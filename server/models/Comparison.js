import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const Comparison = sequelize.define(
  'Comparison',
  withAudit({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'categories', key: 'id' },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requirementsProfile: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'User specified weights and target thresholds',
    },
  }),
  {
    tableName: 'comparisons',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Comparison;
