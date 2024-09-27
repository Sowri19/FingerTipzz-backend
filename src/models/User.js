import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "vendor", "admin"],
    default: "customer",
  },
  isVendor: { type: Boolean, default: false },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
