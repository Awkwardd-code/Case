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

  const email = session.user.email;
  // const email = "atikmahbubakash9@gmail.com";
  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found.');
  }

  const order = await Order.findOne({
    _id: orderId,
    userId: user._id.toString(),
  })
    .populate('billingAddress')
    .populate('shippingAddress')
    .populate('userId')
    .populate('configurationId');

  if (!order) {
    throw new Error('This order does not exist.');
  }

  // ✅ Update order to paid if not already
  if (!order.isPaid) {
    order.isPaid = true;
    await order.save();
  }

  if (order.isPaid) {
    // console.log(order)
    return order
  } else {
    return false
  }
};
