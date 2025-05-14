'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('programs', 'facultyId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'faculties',   // ← точное имя таблицы, как в БД
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('programs', 'facultyId');
  },
};
