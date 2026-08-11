import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const SearchLog = sequelize.define(
  'SearchLog',
  withAudit({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    queryText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    searchType: {
      type: DataTypes.ENUM('keyword', 'nlp_ai', 'filter', 'similar'),
      defaultValue: 'nlp_ai',
    },
    parsedFilters: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    resultCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    executionTimeMs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    userIp: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  }),
  {
    tableName: 'search_logs',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default SearchLog;
