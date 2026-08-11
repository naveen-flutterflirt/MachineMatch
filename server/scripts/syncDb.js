import sequelize from '../config/db.js';
import '../models/index.js';

const syncDatabase = async () => {
  try {
    console.log('🔄 Syncing PostgreSQL Database Schema...');
    await sequelize.authenticate();
    console.log('✅ DB Connection Established.');

    const alter = process.argv.includes('--alter');
    const force = process.argv.includes('--force');

    await sequelize.sync({ alter, force });
    console.log(`🎉 DATABASE SYNC COMPLETE! (alter: ${alter}, force: ${force})`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Sync Error:', error);
    process.exit(1);
  }
};

syncDatabase();
