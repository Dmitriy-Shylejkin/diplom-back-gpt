'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Меняем тип колонки value в grades на STRING
    await queryInterface.changeColumn('grades', 'value', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Откат: возвращаем старый тип INTEGER
    await queryInterface.changeColumn('grades', 'value', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
