'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('grades', 'value', 'grade');
    await queryInterface.changeColumn('grades', 'grade', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('grades', 'grade', 'value');
    await queryInterface.changeColumn('grades', 'value', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
