import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const MachineMedia = sequelize.define(
  'MachineMedia',
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
    type: {
      type: DataTypes.ENUM('image', 'brochure_pdf', 'video', 'manual', 'spec_sheet'),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  }),
  {
    tableName: 'machine_media',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default MachineMedia;
