import { Model, DataTypes } from 'sequelize';

class Address extends Model {
  static associate(models) {
    Address.belongsTo(models.User, { foreignKey: 'UserID' });
  }
}

export default (sequelize) => {
  Address.init(
    {
      AddressID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      AddressType: {
        type: DataTypes.ENUM('Home', 'Work', 'Billing', 'Shipping', 'Other'),
        allowNull: false,
      },
      StreetAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      City: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      State: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      PostalCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      Country: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      IsDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Address',
      tableName: 'Addresses',
      timestamps: true,
    }
  );

  return Address;
};
