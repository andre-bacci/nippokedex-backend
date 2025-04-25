import app from './app';
import config from './config';
import { Pokemon } from './models/pokemon';

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/pokemon', async (req, res) => {
  const pokemon = await Pokemon.find({}).exec();
  res.send(pokemon);
});

app.listen(config.port, () => {
  console.log(`Express is listening at http://localhost:${config.port}`);
});
