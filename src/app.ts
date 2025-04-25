import express from 'express';
import { runMongo } from './database/mongo-cnnct';
import pokemonRoutes from './routes/pokemon';
const app = express();

app.use(express.json());
app.use('/pokemon', pokemonRoutes);

runMongo();

export default app;
