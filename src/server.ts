import express from 'express';
import routes from './routes';
import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { config } from 'dotenv';

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

routes.forEach((route) => {
  app.use(route.path, route.router);
});

AppDataSource.initialize().then(() => {
  console.log('Database connected');
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});
