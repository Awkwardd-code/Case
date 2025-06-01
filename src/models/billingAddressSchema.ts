import mongoose, { Schema, Document } from "mongoose";
import cuid from "cuid";

// Define TypeScript interface for BillingAddress
interface IBillingAddress extends Document {
  _id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
  phoneNumber?: string;
  orders: mongoose.Types.ObjectId[];
}

// Define Mongoose schema for BillingAddress
const BillingAddressSchema: Schema = new Schema<IBillingAddress>(
  {
    _id:        { type: String, default: cuid },
    name:       { type: String, required: true },
    street:     { type: String, required: true },
    city:       { type: String, required: true },
    postalCode: { type: String, required: true },
    country:    { type: String, required: true },
    state:      { type: String, required: false },
    phoneNumber:{ type: String, required: false },
    orders:     [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

// Export Mongoose model
export default mongoose.models.BillingAddress ||
  mongoose.model<IBillingAddress>("BillingAddress", BillingAddressSchema);
