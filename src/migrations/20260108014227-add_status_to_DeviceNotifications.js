'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('DeviceNotifications', 'status', {
      type: Sequelize.ENUM('sent', 'failed'),
      allowNull: false,
      defaultValue: 'sent'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('DeviceNotifications', 'status');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_your_table_name_status";'
    );
  }
};
