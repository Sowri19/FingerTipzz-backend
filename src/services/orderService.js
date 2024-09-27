import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (orderData, customerId) => {
  const order = new Order({ ...orderData, customer: customerId });
  await order.save();

  // Update product stock
  for (let item of orderData.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  return order;
};

export const getOrdersByCustomer = async (customerId) => {
  return await Order.find({ customer: customerId }).populate("items.product");
};

export const getOrdersByVendor = async (vendorId) => {
  return await Order.find({ "items.vendor": vendorId })
    .populate("customer", "name email")
    .populate("items.product");
};

export const updateOrderStatus = async (orderId, status, vendorId) => {
  return await Order.findOneAndUpdate(
    { _id: orderId, "items.vendor": vendorId },
    { $set: { "items.$[elem].status": status } },
    {
      new: true,
      arrayFilters: [{ "elem.vendor": vendorId }],
    }
  );
};
