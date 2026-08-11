import { Sequelize } from 'sequelize';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/machinematch';
const isProduction = process.env.NODE_ENV === 'production' || databaseUrl.includes('neon.tech') || databaseUrl.includes('sslmode=require');

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
    paranoid: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectWithRetry = async () => {
  console.log('⏳ Attempting to connect to PostgreSQL database...');
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (err) {
    console.error('❌ Database connection failed. Retrying in 5 seconds...', err.message);
    setTimeout(connectWithRetry, 5000);
  }
};

export default sequelize;
