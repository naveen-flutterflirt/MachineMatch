import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import sequelize from '../config/db.js';
import '../models/index.js';
import { Op } from 'sequelize';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Upload from '../models/Upload.js';
import Machine from '../models/Machine.js';
import MachineMedia from '../models/MachineMedia.js';
import Specification from '../models/Specification.js';
import Price from '../models/Price.js';
import MachineEmbedding from '../models/MachineEmbedding.js';
import Comparison from '../models/Comparison.js';
import ComparisonItem from '../models/ComparisonItem.js';
import QuoteRequest from '../models/QuoteRequest.js';
import QuoteRequestItem from '../models/QuoteRequestItem.js';
import SearchLog from '../models/SearchLog.js';

const cleanAll = async () => {
  try {
    console.log('🧹 Starting Full Purge of Platform Data (Preserving Admin Only)...');
    await sequelize.authenticate();

    // 1. Delete transactional data
    await QuoteRequestItem.destroy({ where: {}, force: true });
    await QuoteRequest.destroy({ where: {}, force: true });
    await ComparisonItem.destroy({ where: {}, force: true });
    await Comparison.destroy({ where: {}, force: true });
    await Specification.destroy({ where: {}, force: true });
    await MachineMedia.destroy({ where: {}, force: true });
    await Price.destroy({ where: {}, force: true });
    await MachineEmbedding.destroy({ where: {}, force: true });
    await SearchLog.destroy({ where: {}, force: true });
    await Machine.destroy({ where: {}, force: true });
    await Upload.destroy({ where: {}, force: true });
    await Vendor.destroy({ where: {}, force: true });

    // 2. Delete non-admin users
    await User.destroy({
      where: {
        [Op.or]: [
          { userType: { [Op.ne]: 'admin' } },
          { email: { [Op.ne]: 'admin@machinematch.com' } },
        ],
      },
      force: true,
    });

    console.log('✅ DB Tables Cleared: QuoteRequests, Comparisons, Specs, Machines, Uploads, Vendors, SearchLogs, Non-Admin Users.');

    // 3. Clear Uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      let removedCount = 0;
      for (const file of files) {
        if (file !== '.gitkeep') {
          const filePath = path.join(uploadsDir, file);
          if (fs.lstatSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            removedCount++;
          }
        }
      }
      console.log(`✅ Uploads Folder Cleared (${removedCount} files removed).`);
    }

    console.log('🎉 FULL DATA PURGE COMPLETED! Only Admin account & Master Categories remain.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup Error:', error);
    process.exit(1);
  }
};

cleanAll();
