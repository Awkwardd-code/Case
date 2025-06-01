/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/webhook/route.ts

import { connectDB } from '@/config/connectDb';
import { sendOrderEmail } from '@/lib/mailer';
import { stripe } from '@/lib/stripe';
import Order from '@/models/orderSchema';
import Configuration from '@/models/configurationSchema';
import ShippingAddress from '@/models/shippingAddressSchema';
import BillingAddress from '@/models/billingAddressSchema';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

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
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.customer_details) {
        throw new Error('Missing customer details');
      }

      const email = session.customer_details.email;
      const name = session.customer_details.name || 'Unknown';
      const billingAddress = session.customer_details.address;
      const shippingAddress = (session as any).shipping_details?.address as Stripe.Address | undefined;

      if (!email || !billingAddress || !shippingAddress) {
        throw new Error('Missing address information');
      }

      const { userId, orderId, configId } = session.metadata || {};

      if (!userId || !orderId || !configId) {
        throw new Error('Invalid metadata');
      }

      await connectDB();

      // Create and save ShippingAddress
      const shippingDoc = await new ShippingAddress({
        name,
        street: shippingAddress.line1 || '',
        city: shippingAddress.city || '',
        postalCode: shippingAddress.postal_code || '',
        country: shippingAddress.country || '',
        state: shippingAddress.state || '',
        orders: [orderId],
      }).save();

      // Create and save BillingAddress
      const billingDoc = await new BillingAddress({
        name,
        street: billingAddress.line1 || '',
        city: billingAddress.city || '',
        postalCode: billingAddress.postal_code || '',
        country: billingAddress.country || '',
        state: billingAddress.state || '',
        orders: [orderId],
      }).save();

      // Update the order with references to the address documents
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: orderId },
        {
          isPaid: true,
          shippingAddress: shippingDoc._id,
          shippingAddressId: shippingDoc._id,
          billingAddress: billingDoc._id,
          billingAddressId: billingDoc._id,
        },
        { new: true }
      );

      if (!updatedOrder) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Update configuration with order
      await Configuration.findOneAndUpdate(
        { _id: configId },
        { $addToSet: { orders: updatedOrder._id } },
        { new: true }
      );

      // Send confirmation email
      await sendOrderEmail({
        to: email,
        orderId,
        orderDate: updatedOrder.createdAt.toLocaleDateString(),
        shippingAddress: {
          name,
          street: shippingAddress.line1 || '',
          city: shippingAddress.city || '',
          country: shippingAddress.country || '',
          postalCode: shippingAddress.postal_code || '',
          state: shippingAddress.state || '',
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: 'Something went wrong', ok: false },
      { status: 500 }
    );
  }
}
