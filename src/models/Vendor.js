import { Model, DataTypes } from 'sequelize';

class Vendor extends Model {
  static associate(models) {
    Vendor.belongsTo(models.User, { foreignKey: 'UserID' });
  }
}

export default (sequelize) => {
  Vendor.init(
    {
      VendorID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      BusinessName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      BusinessType: {
        type: DataTypes.STRING(50),
      },
      TaxID: {
        type: DataTypes.STRING(50),
      },
      IsVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Vendor',
      tableName: 'Vendors',
      timestamps: true,
    }
  );

  return Vendor;
};
