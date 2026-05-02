const app = require('./app');
const { connectDatabase } = require('./config/database');
const env = require('./config/env');

async function startServer() {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`petcare-api running at ${env.baseUrl}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

