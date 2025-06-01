"use server";

import { connectDB } from "@/config/connectDb";
import Order from "@/models/orderSchema";
import { OrderStatus } from "@/models/configurationSchema"; // Import OrderStatus enum

// Define type for OrderStatus values
type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

export const changeOrderStatus = async ({
  id,
  newStatus,
}: {
  id: string;
  newStatus: OrderStatusType;
}) => {
  await connectDB(); // Ensure MongoDB connection

  await Order.updateOne(
    { _id: id },
    { $set: { status: newStatus } }
  );
};