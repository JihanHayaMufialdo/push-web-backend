'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Devices', 'Devices_nip_fkey');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Devices', {
      fields: ['nip'],
      type: 'foreign key',
      name: 'Devices_nip_fkey', 
      references: {
        table: 'Users',
        field: 'nip',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};

