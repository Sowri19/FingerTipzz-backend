import { Model, DataTypes } from 'sequelize';

class User extends Model {
  static associate(models) {
    User.hasMany(models.Address, { foreignKey: 'UserID' });
    User.hasOne(models.Vendor, { foreignKey: 'UserID' });
    User.hasOne(models.DeliveryDriver, { foreignKey: 'UserID' });
  }
}

export default (sequelize) => {
  User.init(
    {
      UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      PasswordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      FirstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      LastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      UserType: {
        type: DataTypes.ENUM('Customer', 'Vendor', 'DeliveryDriver', 'Admin'),
        allowNull: false,
      },
      CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      LastLogin: {
        type: DataTypes.DATE,
      },
      IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: false,
    }
  );

  return User;
};
