'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {

    static associate(models) {
      Topic.belongsToMany(models.Device, { 
        through: models.DeviceTopic,
        foreignKey: 'topicId'
      });
    }
  }
  Topic.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Topic',
  });
  return Topic;
};