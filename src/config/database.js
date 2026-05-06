const mongoose = require('mongoose');
const env = require('./env');

mongoose.set('bufferCommands', false);

const cachedConnection = global.__petcareMongooseConnection || {
  connection: null,
  promise: null
};

global.__petcareMongooseConnection = cachedConnection;

async function connectDatabase() {
  if (cachedConnection.connection && mongoose.connection.readyState === 1) {
    return cachedConnection.connection;
  }

  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose.connect(env.mongodbUri);
  }

  try {
    cachedConnection.connection = await cachedConnection.promise;
    console.log('MongoDB connected');
    return cachedConnection.connection;
  } catch (error) {
    cachedConnection.promise = null;
    throw error;
  }
}

module.exports = {
  connectDatabase
};

