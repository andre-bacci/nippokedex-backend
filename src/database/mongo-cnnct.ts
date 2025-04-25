import mongoose from 'mongoose';
import config from '../config';

export const runMongo = () => {
  mongoose
    .connect(config.database_uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err: Error) => console.error('Error connecting to MongoDB', err));
};
