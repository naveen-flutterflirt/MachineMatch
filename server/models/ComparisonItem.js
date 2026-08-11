import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const ComparisonItem = sequelize.define(
  'ComparisonItem',
  withAudit({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    comparisonId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'comparisons', key: 'id' },
    },
    machineId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'machines', key: 'id' },
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    calculatedFitScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }),
  {
    tableName: 'comparison_items',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default ComparisonItem;
