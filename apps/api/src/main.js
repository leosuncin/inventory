import './app/models';

import util from 'util';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import paginate from 'express-paginate';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { handleServerError } from './app/middleware';
import categoryRoutes from './app/routes/category.route';
import inventoryRoutes from './app/routes/inventory.route';
import productRoutes from './app/routes/product.route';
import {
  corsOptions,
  morganFormat,
  paginationLimit,
  paginationMaxLimit,
} from './environments/environment';

const port = process.env.PORT || 3333;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(paginate.middleware(paginationLimit, paginationMaxLimit));
app.use(cors(corsOptions));
app.use(morgan(morganFormat));
app.use(helmet());

function listen() {
  if (process.env.NODE_ENV === 'test') return;
  app
    .listen(port, () => {
      console.log('Listening at http://localhost:' + port + '/api');
    })
    .on('error', console.error);
}
function connect() {
  mongoose.connection
    .on('error', () => {
      throw new Error(
        `Unable to connect to database: ${process.env.MONGODB_URL}`,
      );
    })
    .on('disconnected', connect)
    .once('open', listen);

  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', (collectionName, method, query, doc) => {
      console.debug(
        `🙈🙉🙊 ${collectionName}.${method}`,
        util.inspect(query, false, 20),
        doc,
      );
    });
  }

  return mongoose.connect(process.env.MONGODB_URL, {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
}

connect();

const greeting = { message: 'Welcome to api!' };

app.get('/api', (req, res) => {
  res.send(greeting);
});
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventories', inventoryRoutes);
app.use(handleServerError);

export default app;
