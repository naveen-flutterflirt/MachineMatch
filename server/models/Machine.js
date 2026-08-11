import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const Machine = sequelize.define(
  'Machine',
  withAudit({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'categories', key: 'id' },
    },
    vendorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'vendors', key: 'id' },
    },
    modelName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    variant: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    manufacturingYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'draft',
        'pending_review',
        'under_review',
        'approved',
        'published',
        'rejected',
        'archived'
      ),
      defaultValue: 'published',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }),
  {
    tableName: 'machines',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Machine;
