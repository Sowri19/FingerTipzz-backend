import mongoose from 'mongoose';
import Category from './Category.js';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    attributes: { type: Map, of: mongoose.Schema.Types.Mixed },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [String],
  },
  { timestamps: true }
);

productSchema.pre('save', async function (next) {
  try {
    const category = await Category.findById(this.category);
    if (!category) {
      throw new Error('Invalid category');
    }

    // Validate attributes
    for (const [key, value] of this.attributes) {
      const attrSchema = category.attributes.find((a) => a.name === key);
      if (!attrSchema) {
        throw new Error(`Invalid attribute: ${key}`);
      }
      if (attrSchema.required && (value === undefined || value === null)) {
        throw new Error(`${key} is required`);
      }
      if (attrSchema.type === 'select' && !attrSchema.options.includes(value)) {
        throw new Error(`Invalid option for ${key}`);
      }
    }

    // Calculate price
    let price = category.basePrice;
    for (const modifier of category.priceModifiers) {
      const attrValue = this.attributes.get(modifier.attribute);
      if (attrValue === modifier.value) {
        price *= modifier.modifier;
      }
    }
    this.price = Number(price.toFixed(2));
  } catch (error) {
    return next(error);
  }
  next();
});

export default mongoose.model('Product', productSchema);
