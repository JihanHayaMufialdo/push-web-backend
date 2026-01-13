'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminAccount extends Model {

    static associate(models) {
      AdminAccount.hasMany(models.Notification, {
        foreignKey: 'sendBy'
      });
    }
  }
  AdminAccount.init({
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'AdminAccount',
  });

  return AdminAccount;
};