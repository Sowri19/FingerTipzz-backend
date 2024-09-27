import Store from "../models/Store.js";
import User from "../models/User.js";

export const createStore = async (storeData, ownerId) => {
  const store = new Store({ ...storeData, owner: ownerId });
  await store.save();
  await User.findByIdAndUpdate(ownerId, { isVendor: true, store: store._id });
  return store;
};

export const getStoreByOwner = async (ownerId) => {
  return await Store.findOne({ owner: ownerId }).populate("products");
};

export const updateStore = async (storeId, updateData, ownerId) => {
  return await Store.findOneAndUpdate(
    { _id: storeId, owner: ownerId },
    updateData,
    { new: true }
  );
};

export const getStoreProducts = async (storeId) => {
  const store = await Store.findById(storeId).populate("products");
  return store ? store.products : [];
};
