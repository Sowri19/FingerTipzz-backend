import { Sequelize } from 'sequelize';
import userModel from './User.js';
import vendorModel from './Vendor.js';
import storeModel from './Store.js';
import addressModel from './Address.js';
import deliveryDriverModel from './DeliveryDriver.js';
import productModel from './Product.js';
import orderModel from './Order.js';
import categoryModel from './Category.js';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql', // or 'postgres', 'sqlite', 'mssql'
  logging: false, // set to console.log to see the raw SQL queries
});

const models = {
  User: userModel(sequelize),
  Vendor: vendorModel(sequelize),
  Store: storeModel(sequelize),
  Address: addressModel(sequelize),
  DeliveryDriver: deliveryDriverModel(sequelize),
  Product: productModel(sequelize),
  Order: orderModel(sequelize),
  Category: categoryModel(sequelize),
};

// Set up associations
Object.values(models)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models));

export { sequelize };
export default models;
