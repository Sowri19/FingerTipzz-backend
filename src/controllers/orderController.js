import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const order = new Order({
      customer: req.user.userId,
      items,
      totalAmount,
    });
    await order.save();

    // Update product stock
    for (let item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.userId })
      .populate("items.product")
      .populate("items.vendor", "name")
      .populate("items.store", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "items.vendor": req.user.userId })
      .populate("customer", "name email")
      .populate("items.product")
      .populate("items.store", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendor orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, "items.vendor": req.user.userId },
      { $set: { "items.$[elem].status": status } },
      {
        new: true,
        arrayFilters: [{ "elem.vendor": req.user.userId }],
      }
    );
    if (!order) {
      return res
        .status(404)
        .json({ error: "Order not found or you are not authorized" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};
