'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {

    static associate(models) {
      Notification.hasMany(models.DeviceNotification, {
        foreignKey: 'deviceId'
      });
    }
  }
  Notification.init({
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    sendBy: DataTypes.UUID,
    link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};