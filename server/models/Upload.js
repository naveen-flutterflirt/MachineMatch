import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const Upload = sequelize.define(
  'Upload',
  withAudit({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    uploadedByUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    originalName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'processed', 'failed'),
      defaultValue: 'pending',
    },
    ocrExtractedData: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }),
  {
    tableName: 'uploads',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Upload;
