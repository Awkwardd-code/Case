'use server';

import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products';
import { connectDB } from '@/config/connectDb';
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import Configuration from '@/models/configurationSchema';
import User from '@/models/User';
import Order from '@/models/orderSchema';

export const createCheckoutSession = async ({ configId }: { configId: string }) => {
  await connectDB();

  const session = await getServerSession();

  if (!session?.user?.email) {
    throw new Error('You must be logged in to proceed with checkout.');
  }

  const email = session.user.email;
  // const email = "atikmahbubakash9@gmail.com";

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const configuration = await Configuration.findById(configId);
  if (!configuration) {
    throw new Error('Configuration not found');
  }

  const { finish, material, imageUrl } = configuration;

  // Calculate price in cents
  let price = BASE_PRICE;
  if (finish === 'textured') price += PRODUCT_PRICES.finish.textured;
  if (material === 'polycarbonate') price += PRODUCT_PRICES.material.polycarbonate;

  // Find existing order by userId and configurationId
  let order = await Order.findOne({
    userId: user._id.toString(),
    configurationId: configuration._id.toString(),
  });

  if (!order) {
    order = await Order.create({
      amount: price / 100, // Store in dollars if Stripe uses cents
      userId: user._id.toString(),
      configurationId: configuration._id.toString(),
    });
  }

  const product = await stripe.products.create({
    name: 'Custom iPhone Case',
    images: [imageUrl],
    default_price_data: {
      currency: 'USD',
      unit_amount: price, // price in cents
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order._id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration._id}`,
    payment_method_types: ['card'],
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['US', 'DE'],
    },
    metadata: {
      userId: user._id.toString(),
      orderId: order._id.toString(),
    },
    line_items: [
      {
        price: product.default_price as string,
        quantity: 1,
      },
    ],
  });

  return { url: stripeSession.url };
};
