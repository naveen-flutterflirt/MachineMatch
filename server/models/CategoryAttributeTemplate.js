import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const CategoryAttributeTemplate = sequelize.define(
  'CategoryAttributeTemplate',
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
    attributeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'attribute_masters', key: 'id' },
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    unitOptions: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  }),
  {
    tableName: 'category_attribute_templates',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default CategoryAttributeTemplate;
