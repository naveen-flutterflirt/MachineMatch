import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const QuoteRequestItem = sequelize.define(
  'QuoteRequestItem',
  withAudit({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quoteRequestId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'quote_requests', key: 'id' },
    },
    machineId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'machines', key: 'id' },
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    requestedPrice: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }),
  {
    tableName: 'quote_request_items',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default QuoteRequestItem;
