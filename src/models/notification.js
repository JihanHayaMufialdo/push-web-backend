'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {

    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: 'sendBy'
      });
      Notification.hasMany(models.DeviceNotification, {
        foreignKey: 'deviceId'
      });
    }
  }
  Notification.init({
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    sendBy: DataTypes.UUID,
    link: DataTypes.STRING,
    status: DataTypes.ENUM('queued','sent','failed'),
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};