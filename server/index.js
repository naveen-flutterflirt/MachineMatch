import 'dotenv/config';
import app from './app.js';
import sequelize, { connectWithRetry } from './config/db.js';

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  await connectWithRetry();

  server = app.listen(PORT, () => {
    console.log(`🚀 MachineMatch Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

const gracefulShutdown = (signal) => {
  console.log(`⚠️ Received ${signal}. Initiating graceful shutdown...`);
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed.');
      sequelize.close().then(() => {
        console.log('✅ PostgreSQL connection closed.');
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
