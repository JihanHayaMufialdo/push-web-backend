'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {

    static associate(models) {
      Notification.belongsTo(models.AdminAccount, {
        foreignKey: 'sendBy'
      });
      Notification.hasMany(models.DeviceNotification, {
        foreignKey: 'notificationId'
      });
      Notification.belongsToMany(models.Device, { 
        through: models.DeviceNotification,
        foreignKey: 'notificationId'
      });
      Notification.belongsTo(models.Topic, { 
        foreignKey: 'topicId'
      });
      
    }
  }
  Notification.init({
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    sendBy: DataTypes.STRING,
    link: DataTypes.STRING,
    topicId: DataTypes.INTEGER,
    status: DataTypes.ENUM('queued','sent','failed'),
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};