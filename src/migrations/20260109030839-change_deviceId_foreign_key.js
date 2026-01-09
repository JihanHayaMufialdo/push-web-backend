'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('DeviceNotifications', 'deviceId', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.changeColumn('DeviceTopics', 'deviceId', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addConstraint('DeviceNotifications', {
      fields: ['deviceId'],
      type: 'foreign key',
      name: 'DeviceNotifications_deviceId_fkey',
      references: {
        table: 'Devices',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('DeviceTopics', {
      fields: ['deviceId'],
      type: 'foreign key',
      name: 'DeviceTopics_deviceId_fkey',
      references: {
        table: 'Devices',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
