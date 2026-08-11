import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const Price = sequelize.define(
  'Price',
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
    priceType: {
      type: DataTypes.ENUM(
        'ex_factory',
        'dealer_price',
        'retail_mrp',
        'discount_price',
        'offer_price',
        'rental_day_rate',
        'rental_month_rate'
      ),
      allowNull: false,
      defaultValue: 'ex_factory',
    },
    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'INR',
    },
    region: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    effectiveFrom: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    effectiveTo: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }),
  {
    tableName: 'prices',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Price;
