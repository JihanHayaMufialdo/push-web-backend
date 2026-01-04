'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.Device, {
        foreignKey: 'nip'
      });
    }
  }
  User.init({
    nip: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    department: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};