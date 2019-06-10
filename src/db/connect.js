import Mongoose from 'mongoose';
import config from '../config/config';

Promise = require('bluebird'); // eslint-disable-line no-global-assign

Mongoose.Promise = Promise;

const connectToDb = async () => {
  const mongoUri = config.mongo.host;
  try {
    await Mongoose.connect(mongoUri, {
      keepAlive: true,
      useNewUrlParser: true,
    });
    Mongoose.set('useFindAndModify', false);
  }
 catch (err) {
    throw new Error(`unable to connect to database: ${mongoUri}`);
  }
};

export default connectToDb;
