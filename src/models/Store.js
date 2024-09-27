import { Model, DataTypes } from 'sequelize';

class Store extends Model {
  static associate(models) {
    Store.belongsTo(models.Vendor, { foreignKey: 'VendorID' });
    Store.hasMany(models.Product, { foreignKey: 'StoreID' });
  }
}

export default (sequelize) => {
  Store.init(
    {
      StoreID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      VendorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      Description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Store',
      tableName: 'Stores',
      timestamps: true,
    }
  );

  return Store;
};
