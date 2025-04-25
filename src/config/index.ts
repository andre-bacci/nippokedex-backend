import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  database_uri: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  database_uri: String(process.env.MONGODB_URI) || '',
};

export default config;
