'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Devices', 'nip', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.removeColumn('Devices', 'userId');

    await queryInterface.addConstraint('Devices', {
      fields: ['nip'],
      type: 'foreign key',
      name: 'Devices_nip_fkey',
      references: {
        table: 'Users',
        field: 'nip'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Devices', 'Devices_nip_fkey');

    await queryInterface.addColumn('Devices', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.removeColumn('Devices', 'nip');

    await queryInterface.addConstraint('Devices', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Devices_userId_fkey',
      references: {
        table: 'Users',
        field: 'userId'
      }
    });
  }
};
