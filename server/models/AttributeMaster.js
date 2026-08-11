import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const AttributeMaster = sequelize.define(
  'AttributeMaster',
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
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    dataType: {
      type: DataTypes.ENUM('number', 'string', 'boolean', 'enum'),
      defaultValue: 'number',
    },
    standardUnit: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    higherIsBetter: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    defaultWeight: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }),
  {
    tableName: 'attribute_masters',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default AttributeMaster;
