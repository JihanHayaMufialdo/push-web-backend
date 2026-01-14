'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Notifications', 'readAt');

    await queryInterface.addColumn('DeviceNotifications', 'readAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Notifications', 'readAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.removeColumn('DeviceNotifications', 'readAt');
  }
};
