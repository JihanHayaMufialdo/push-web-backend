'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeviceTopic extends Model {
    static associate(models) {
      DeviceTopic.belongsTo(models.Device, {
        foreignKey: 'deviceId'
      });
      DeviceTopic.belongsTo(models.Topic, {
        foreignKey: 'topicId'
      });
    }
  }
  DeviceTopic.init({
    topicId: DataTypes.INTEGER,
    deviceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DeviceTopic',
  });
  return DeviceTopic;
};