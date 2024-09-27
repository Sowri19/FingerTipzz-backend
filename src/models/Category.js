import mongoose from 'mongoose';

const attributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'select'],
      required: true,
    },
    options: [String], // For 'select' type
    required: { type: Boolean, default: false },
  },
  { _id: false }
);

const priceModifierSchema = new mongoose.Schema(
  {
    attribute: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    modifier: { type: Number, required: true }, // Percentage modifier (e.g., 1.1 for 10% increase)
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    attributes: [attributeSchema],
    priceModifiers: [priceModifierSchema],
    basePrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
