'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeConstraint(
      'Devices',
      'Devices_userId_fkey'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Devices', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Devices_userId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      }
    });
  }
};


