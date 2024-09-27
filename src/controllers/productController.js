import Product from "../models/Product.js";
import Store from "../models/Store.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const store = await Store.findOne({ owner: req.user.userId });
    if (!store) {
      return res
        .status(400)
        .json({ error: "Vendor must have a store to create products" });
    }
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      vendor: req.user.userId,
      store: store._id,
    });
    await product.save();
    await Store.findByIdAndUpdate(store._id, {
      $push: { products: product._id },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("vendor", "name")
      .populate("store", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("vendor", "name")
      .populate("store", "name");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user.userId },
      { name, description, price, category, stock },
      { new: true }
    );
    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found or you are not authorized" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      vendor: req.user.userId,
    });
    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found or you are not authorized" });
    }
    await Store.findByIdAndUpdate(product.store, {
      $pull: { products: product._id },
    });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
