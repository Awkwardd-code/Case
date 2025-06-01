'use server'

import { connectDB } from "@/config/connectDb";
import { getServerSession } from 'next-auth'
import User from "@/models/User";

import orderSchema from "@/models/orderSchema";

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const session = await getServerSession();

  if (!session?.user?.email) {
    throw new Error('You need to be logged in to view this page.')
  }
  await connectDB();

  const user = await User.findOne({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error('User not found.')
  }

  const order = await orderSchema.findOne({
    where: {
      id: orderId,
      userId: user.id,
    },
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true,
    },
  })

  if (!order) {
    throw new Error('This order does not exist.')
  }

  return order.isPaid ? order : false
}
