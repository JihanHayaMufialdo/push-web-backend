'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.Device, {
        foreignKey: 'userId'
      });
    }
  }
  User.init({
    nip: DataTypes.STRING,
    name: DataTypes.STRING,
    department: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};