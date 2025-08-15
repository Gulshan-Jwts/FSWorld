import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  phone: String,
  image: String,
  id: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
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
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  Orders: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
