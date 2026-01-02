'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Device extends Model {

    static associate(models) {
      Device.belongsTo(models.User, {
        foreignKey: 'nip'
      });
      Device.hasMany(models.DeviceNotification, {
        foreignKey: 'deviceId'
      });
      Device.hasMany(models.DeviceTopic, {
        foreignKey: 'deviceId'
      });
      Device.belongsToMany(models.Topic, { 
        through: models.DeviceTopic,
        foreignKey: 'deviceId'
      });
      Device.belongsToMany(models.Notification, { 
        through: models.DeviceNotification,
        foreignKey: 'deviceId'
      });
    }
  }
  Device.init({
    token: DataTypes.TEXT,
    platform: DataTypes.ENUM('ios','android','web'),
    isActive: DataTypes.BOOLEAN,
    nip: DataTypes.STRING,
    lastError: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Device',
  });

  return Device;
};