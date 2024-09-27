import { Model, DataTypes } from 'sequelize';

class DeliveryDriver extends Model {
  static associate(models) {
    DeliveryDriver.belongsTo(models.User, { foreignKey: 'UserID' });
  }
}

export default (sequelize) => {
  DeliveryDriver.init(
    {
      DriverID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      LicenseNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      VehicleType: {
        type: DataTypes.STRING(50),
      },
      IsAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      CurrentLocation: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'DeliveryDriver',
      tableName: 'DeliveryDrivers',
      timestamps: true,
    }
  );

  return DeliveryDriver;
};
