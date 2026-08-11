import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const Vendor = sequelize.define(
  'Vendor',
  withAudit({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    companyRegistrationNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    taxId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      defaultValue: 'India',
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contactPersonName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    logoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.0,
    },
  }),
  {
    tableName: 'vendors',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Vendor;
