import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        _id: false,
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        color: String,
        size: String,
        priceAtPurchase: Number,
      },
    ],
    totalAmount: Number,
    vendorPrice: Number,
    OrderId: String,
    shipmentId: String,
    trackingCode: String,
    trackingUrl: String,
    courierBy: String,
    address: {
      houseNumber: String,
      street: String,
      landmark: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: "india",
      },
      pincode: String,
    },
    affilator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "Created" }, // can be Completed or RTO
    cancelled: {
      status: { type: Boolean, default: false },
      time: { type: Date, default: Date.now },
    },
    wasExchanged: {
      status: { type: Boolean, default: false },
      forProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    },
    exchanged: {
      status: { type: String, default: "none" }, // can be initiated/returned/created
      forProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    },
    purchasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
