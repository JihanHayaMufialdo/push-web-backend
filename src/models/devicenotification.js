'use strict';
const {
  Model
} = require('sequelize');
const notification = require('./notification');
module.exports = (sequelize, DataTypes) => {
  class DeviceNotification extends Model {

    static associate(models) {
      DeviceNotification.belongsTo(models.Device, {
        foreignKey: 'deviceId'
      });
      DeviceNotification.belongsTo(models.Notification, {
        foreignKey: 'notificationId'
      });
    }
  }
  DeviceNotification.init({
    deviceId: DataTypes.INTEGER,
    notificationId: DataTypes.INTEGER,
    status: DataTypes.ENUM('sent', 'failed')
  }, {
    sequelize,
    modelName: 'DeviceNotification',
  });
  return DeviceNotification;
};