'use server';

import { connectDB } from "@/config/connectDb";
import { getServerSession } from 'next-auth';
import User from "@/models/User";
import Order from "@/models/orderSchema"; // Renamed for clarity

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const session = await getServerSession();

  if (!session?.user?.email) {
    throw new Error('You need to be logged in to view this page.');
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    throw new Error('User not found.');
  }

  const order = await Order.findOne({
    _id: orderId,
    userId: user._id.toString(),
  })
    .populate('billingAddress')
    .populate('shippingAddress')
    .populate('userId') // Optional: this will populate user if you need
    .populate('configurationId'); // Optional: populate configuration if referenced

  if (!order) {
    throw new Error('This order does not exist.');
  }

  return order.isPaid ? order : false;
};
