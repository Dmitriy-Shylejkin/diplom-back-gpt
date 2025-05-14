'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // делаем email и phone уникальными
    await queryInterface.changeColumn('students', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn('students', 'phone', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // откат: убираем unique
    await queryInterface.changeColumn('students', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });
    await queryInterface.changeColumn('students', 'phone', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });
  },
};
