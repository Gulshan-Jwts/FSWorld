import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        priceAtPurchase: Number,
      },
    ],
    totalAmount: Number,
    OrderId: String,
    shipmentId: String,
    trackingCode: String,
    trackingUrl: String,
    courierBy: String,
    affilator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "Created" }, // can be Completed or RTO
    cancelled: {
      status: { type: Boolean, default: false },
      time: { type: Date, default: Date.now },
    },
    exchanged: {
      status: { type: String, default: "none" }, // can be initiated/returned/created
      forProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    },
    purchasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
