"use server";

import { connectDB } from "@/config/connectDb";
import Order from "@/models/orderSchema";
import { OrderStatus } from "@/models/configurationSchema";

// Define type for OrderStatus values
type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

// Define interface for fetched orders
interface Order {
  _id: string;
  user: { email: string };
  shippingAddress?: { name: string };
  status: OrderStatusType;
  createdAt: Date;
  amount: number;
}

export async function fetchOrders() {
  await connectDB();

  // Fetch orders from the last 7 days
  const orders = await Order.find({
      isPaid: true,
      createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
  })
      .sort({ createdAt: -1 })
      .populate("user", "email")
      .populate("shippingAddress", "name")
      .lean()
      .exec() as unknown as Order[];

  // Aggregate sum for last week
  const lastWeekSum = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    },
    {
      $group: {
        _id: null,
        amount: { $sum: "$amount" },
      },
    },
  ]);

  // Aggregate sum for last month
  const lastMonthSum = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    },
    {
      $group: {
        _id: null,
        amount: { $sum: "$amount" },
      },
    },
  ]);

  return {
    orders,
    lastWeekSum: lastWeekSum[0]?.amount ?? 0,
    lastMonthSum: lastMonthSum[0]?.amount ?? 0,
  };
}