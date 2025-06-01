import mongoose, { Schema, Document } from "mongoose";
import cuid from "cuid";
import { OrderStatus } from "./configurationSchema";

interface IOrder extends Document {
  _id: string;
  configurationId: string;
  userId: string;
  amount: number;
  isPaid: boolean;
  status: string;
  shippingAddressId?: string;
  shippingAddress?: mongoose.Types.ObjectId;
  billingAddressId?: string;
  billingAddress?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema<IOrder>(
  {
    _id: { type: String, default: cuid },
    configurationId: { type: String, required: true },
    userId: { type: String, required: true, ref: "User" },
    amount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.AWAITING_SHIPMENT,
    },
    shippingAddressId: { type: String },
    shippingAddress: { type: Schema.Types.ObjectId, ref: "ShippingAddress" },
    billingAddressId: { type: String },
    billingAddress: { type: Schema.Types.ObjectId, ref: "BillingAddress" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);