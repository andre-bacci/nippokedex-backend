import cors from 'cors';
import express from 'express';
import { runMongo } from './database/mongo-cnnct';
import pokemonRoutes from './routes/pokemon';
const app = express();
app.use(
  cors({
    credentials: true,
    methods: 'POST,GET,PUT,OPTIONS,DELETE',
  }),
);
app.use(express.json());
app.use('/pokemon', pokemonRoutes);

runMongo();

export default app;
