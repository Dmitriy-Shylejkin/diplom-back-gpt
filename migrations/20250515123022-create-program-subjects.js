'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('program_subjects', {
      programId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'programs', key: 'id' },
        onDelete: 'CASCADE'
      },
      subjectId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'subjects', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('program_subjects');
  }
};
