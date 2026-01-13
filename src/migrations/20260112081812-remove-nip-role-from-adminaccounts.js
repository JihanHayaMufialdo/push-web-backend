'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('AdminAccounts', 'nip');
    await queryInterface.removeColumn('AdminAccounts', 'role');

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('AdminAccounts', 'nip', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('AdminAccounts', 'role', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
