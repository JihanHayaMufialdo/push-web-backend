'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Devices', 'id_new', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.sequelize.query(
      `UPDATE "Devices" SET "id_new" = "id"::text;`
    );

    await queryInterface.removeConstraint('Devices', 'Devices_pkey'); 

    await queryInterface.removeColumn('Devices', 'id');

    await queryInterface.renameColumn('Devices', 'id_new', 'id');

    await queryInterface.addConstraint('Devices', {
      fields: ['id'],
      type: 'primary key',
      name: 'Devices_pkey'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Devices', 'Devices_pkey');
  
    await queryInterface.addColumn('Devices', 'id_old', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false
    });
  
    await queryInterface.removeColumn('Devices', 'id');
  
    await queryInterface.renameColumn('Devices', 'id_old', 'id');
  
    await queryInterface.addConstraint('Devices', {
      fields: ['id'],
      type: 'primary key',
      name: 'Devices_pkey'
    });
  }
  
};
