import Product from "../models/Product.js";

export const createProduct = async (productData, vendorId) => {
  const product = new Product({ ...productData, vendor: vendorId });
  await product.save();
  return product;
};

export const getProducts = async (filters = {}) => {
  return await Product.find(filters).populate("vendor", "name");
};

export const getProductById = async (productId) => {
  return await Product.findById(productId).populate("vendor", "name");
};

export const updateProduct = async (productId, updateData, vendorId) => {
  return await Product.findOneAndUpdate(
    { _id: productId, vendor: vendorId },
    updateData,
    { new: true }
  );
};

export const deleteProduct = async (productId, vendorId) => {
  return await Product.findOneAndDelete({ _id: productId, vendor: vendorId });
};
