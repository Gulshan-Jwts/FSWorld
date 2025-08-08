import mongoose from "mongoose";

const affilatorSchema = new mongoose.Schema(
  {
    isLoggedIn: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },

    sales: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        date: { type: Date, default: Date.now },
      },
    ],

    clicks: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        date: { type: Date, default: Date.now },
      },
    ],
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    links: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { _id: false }
);

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
    district: String,
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
  affilator: affilatorSchema,
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
