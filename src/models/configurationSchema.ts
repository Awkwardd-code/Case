import mongoose, { Schema, Document } from "mongoose";
import cuid from "cuid";

// Define enums as objects
const OrderStatus = {
  FULFILLED: "fulfilled",
  SHIPPED: "shipped",
  AWAITING_SHIPMENT: "awaiting_shipment",
} as const;

const PhoneModel = {
  IPHONEX: "iphonex",
  IPHONE11: "iphone11",
  IPHONE12: "iphone12",
  IPHONE13: "iphone13",
  IPHONE14: "iphone14",
  IPHONE15: "iphone15",
} as const;

const CaseMaterial = {
  SILICONE: "silicone",
  POLYCARBONATE: "polycarbonate",
} as const;

const CaseFinish = {
  SMOOTH: "smooth",
  TEXTURED: "textured",
} as const;

const CaseColor = {
  BLACK: "black",
  BLUE: "blue",
  ROSE: "rose",
} as const;

// Define and export TypeScript interface for Configuration
export interface IConfiguration extends Document {
  _id: string;
  width: number;
  height: number;
  imageUrl: string;
  color?: string;
  phoneModel?: string;
  material?: string;
  finish?: string;
  croppedImageUrl?: string;
  orders: mongoose.Types.ObjectId[];
}

// Define Mongoose schema
const ConfigurationSchema: Schema<IConfiguration> = new Schema<IConfiguration>(
  {
    _id: { type: String, default: cuid },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    color: {
      type: String,
      enum: Object.values(CaseColor),
      required: false,
    },
    phoneModel: {
      type: String,
      enum: Object.values(PhoneModel),
      required: false,
    },
    material: {
      type: String,
      enum: Object.values(CaseMaterial),
      required: false,
    },
    finish: {
      type: String,
      enum: Object.values(CaseFinish),
      required: false,
    },
    croppedImageUrl: { type: String, required: false },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

// Create and export model
const Configuration =
  mongoose.models.Configuration ||
  mongoose.model<IConfiguration>("Configuration", ConfigurationSchema);

export default Configuration;
export {
  Configuration, // Named export for the Mongoose model
  OrderStatus,
  PhoneModel,
  CaseMaterial,
  CaseFinish,
  CaseColor,
};