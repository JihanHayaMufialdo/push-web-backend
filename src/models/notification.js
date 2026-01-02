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
        foreignKey: 'notificationId'
      });
      Notification.belongsToMany(models.Device, { 
        through: models.DeviceNotification,
        foreignKey: 'notificationId'
      });
    }
  }
  Notification.init({
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    sendBy: DataTypes.STRING,
    link: DataTypes.STRING,
    status: DataTypes.ENUM('queued','sent','failed'),
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};