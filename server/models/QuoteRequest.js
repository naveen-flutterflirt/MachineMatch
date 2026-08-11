import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const QuoteRequest = sequelize.define(
  'QuoteRequest',
  withAudit({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    buyerUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    vendorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'vendors', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('submitted', 'viewed', 'responded', 'closed', 'declined'),
      defaultValue: 'submitted',
    },
    contactName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    contactPhone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    contactEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    targetDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    preferredFinancing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }),
  {
    tableName: 'quote_requests',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default QuoteRequest;
