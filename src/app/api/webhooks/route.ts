// src/app/api/webhook/route.ts
import { connectDB } from '@/config/connectDb';
import { sendOrderEmail } from '@/lib/mailer';
import { stripe } from '@/lib/stripe';
import orderSchema from '@/models/orderSchema';
import Configuration from '@/models/configurationSchema';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session & {
        shipping_details?: { address: Stripe.Address };
      };

      if (!session.customer_details?.email) {
        throw new Error('Missing user email');
      }

      const { userId, orderId, configId } = session.metadata || {
        userId: null,
        orderId: null,
        configId: null,
      };

      if (!userId || !orderId || !configId) {
        throw new Error('Invalid request metadata');
      }

      const billingAddress = session.customer_details.address;
      const shippingAddress = session.shipping_details?.address;

      if (!shippingAddress || !billingAddress) {
        throw new Error('Missing shipping or billing address');
      }

      await connectDB();

      // Update the order
      const updatedOrder = await orderSchema.findOneAndUpdate(
        { _id: orderId },
        {
          isPaid: true,
          shippingAddress: {
            name: session.customer_details.name || 'Unknown',
            city: shippingAddress.city || '',
            country: shippingAddress.country || '',
            postalCode: shippingAddress.postal_code || '',
            street: shippingAddress.line1 || '',
            state: shippingAddress.state || undefined,
          },
          billingAddress: {
            name: session.customer_details.name || 'Unknown',
            city: billingAddress.city || '',
            country: billingAddress.country || '',
            postalCode: billingAddress.postal_code || '',
            street: billingAddress.line1 || '',
            state: billingAddress.state || undefined,
          },
        },
        { new: true }
      );

      if (!updatedOrder) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Update Configuration to include the order
      await Configuration.findOneAndUpdate(
        { _id: configId },
        { $addToSet: { orders: new mongoose.Types.ObjectId(orderId) } },
        { new: true }
      );

      // Send order confirmation email
      await sendOrderEmail({
        to: session.customer_details.email,
        orderId,
        orderDate: updatedOrder.createdAt.toLocaleDateString(),
        shippingAddress: {
          name: session.customer_details.name || 'Unknown',
          city: shippingAddress.city || '',
          country: shippingAddress.country || '',
          postalCode: shippingAddress.postal_code || '',
          street: shippingAddress.line1 || '',
          state: shippingAddress.state || undefined,
        },
      });
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { message: 'Something went wrong', ok: false },
      { status: 500 }
    );
  }
}