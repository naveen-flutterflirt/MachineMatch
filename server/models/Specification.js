import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const Specification = sequelize.define(
  'Specification',
  withAudit({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    machineId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'machines', key: 'id' },
    },
    attributeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'attribute_masters', key: 'id' },
    },
    rawValue: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rawUnit: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    normalizedValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    normalizedUnit: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    source: {
      type: DataTypes.ENUM('manual', 'ai_ocr', 'vendor_feed', 'admin_override'),
      defaultValue: 'manual',
    },
    confidenceScore: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
    },
  }),
  {
    tableName: 'specifications',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Specification;
