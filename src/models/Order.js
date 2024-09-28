import mongoose from 'mongoose';

// Define a schema for order items
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    attributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  { _id: false }
);

// Define the main order schema
const orderSchema = new mongoose.Schema(
  {
    OrderID: {
      type: String,
      required: true,
      unique: true,
    },
    UserID: {
      type: Number,
      required: true,
    },
    AddressID: {
      type: Number,
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for getting the item count
orderSchema.virtual('itemCount').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Pre-save hook to calculate total amount
orderSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  next();
});

// Static method to find orders by user
orderSchema.statics.findByUser = function (userId) {
  return this.find({ UserID: userId }).sort({ createdAt: -1 });
};

// Instance method to cancel an order
orderSchema.methods.cancelOrder = function () {
  if (this.status === 'pending' || this.status === 'processing') {
    this.status = 'cancelled';
    return this.save();
  }
  throw new Error('Cannot cancel order that has been shipped or delivered');
};

// Create the model from the schema
const Order = mongoose.model('Order', orderSchema);

export default Order;
