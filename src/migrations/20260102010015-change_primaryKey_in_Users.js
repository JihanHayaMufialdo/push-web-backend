'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Users', 'Users_pkey');

    await queryInterface.removeConstraint('Users', 'Users_nip_key');

    await queryInterface.addConstraint('Users', {
      fields: ['nip'],
      type: 'primary key',
      name: 'Users_pkey'
    });

    await queryInterface.removeColumn('Users', 'id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'id', {
      type: Sequelize.UUID,
      primaryKey: true
    });

    await queryInterface.removeConstraint('Users', 'Users_pkey');

    await queryInterface.addConstraint('Users', {
      fields: ['userId'],
      type: 'primary key',
      name: 'Users_pkey'
    });
  }
};


