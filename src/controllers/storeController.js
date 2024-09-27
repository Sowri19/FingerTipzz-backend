import Store from "../models/Store.js";
import User from "../models/User.js";

export const createStore = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existingStore = await Store.findOne({ owner: req.user.userId });
    if (existingStore) {
      return res.status(400).json({ error: "You already have a store" });
    }
    const store = new Store({
      name,
      description,
      owner: req.user.userId,
    });
    await store.save();
    await User.findByIdAndUpdate(req.user.userId, {
      isVendor: true,
      store: store._id,
    });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: "Failed to create store" });
  }
};

export const getStore = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.userId }).populate(
      "products"
    );
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch store" });
  }
};

export const updateStore = async (req, res) => {
  try {
    const { name, description } = req.body;
    const store = await Store.findOneAndUpdate(
      { owner: req.user.userId },
      { name, description },
      { new: true }
    );
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: "Failed to update store" });
  }
};

export const getStoreProducts = async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId).populate("products");
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.json(store.products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch store products" });
  }
};
