import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const Category = sequelize.define(
  'Category',
  withAudit({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    iconUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }),
  {
    tableName: 'categories',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Category;
