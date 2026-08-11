import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { withAudit } from './helpers/withAudit.js';

const MachineEmbedding = sequelize.define(
  'MachineEmbedding',
  withAudit({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    machineId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'machines', key: 'id' },
    },
    embedding: {
      // In PostgreSQL with pgvector extension enabled, this aligns with VECTOR type
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Vector embeddings array for pgvector similarity search',
    },
    specSummaryText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastGeneratedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }),
  {
    tableName: 'machine_embeddings',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default MachineEmbedding;
