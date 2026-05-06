const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const routes = require('./routes');
const { connectDatabase } = require('./config/database');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'swagger', 'swagger.yaml'));

async function ensureDatabaseConnection(req, res, next) {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
}

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', ensureDatabaseConnection, routes);
app.use(errorHandler);

module.exports = app;

