'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Notifications', 'title', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('Notifications', 'link', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Notifications', 'title', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.changeColumn('Notifications', 'link', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
