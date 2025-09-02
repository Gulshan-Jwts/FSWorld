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
    chanelOrderId: String,
    shipmentId: String,
    trackingCode: String,
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
    status: { type: String, default: "Created" }, // can be Completed,Cancelled,Exchanged or RTO
    cancelled: {
      status: { type: Boolean, default: false },
      time: Date ,
    },
    wasExchanged: {
      status: { type: Boolean, default: false },
      forProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    },
    exchanged: {
      status: { type: String, default: "none" }, // can be initiated/returned/created
      forProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    },
    returnInfo: {
      shipmentId: String,
      orderId: String,
      awbCode: String,
      courierName: String,
      status: String,
      createdAt: { type: Date, default: Date.now },
    },
    purchasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
