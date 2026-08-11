import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const User = sequelize.define(
  'User',
  withAudit({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    userType: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    },
    status: {
      type: DataTypes.ENUM('pending_verification', 'active', 'suspended'),
      defaultValue: 'active',
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }),
  {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  }
);

export default User;
