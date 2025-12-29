'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Notifications',
      'status',
      {
        type: Sequelize.ENUM('sent','failed'),
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Notifications',
      'status',
    );
  }
};
