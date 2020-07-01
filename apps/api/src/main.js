import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import paginate from 'express-paginate';
import helmet from 'helmet';
import morgan from 'morgan';

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

listen();

const greeting = { message: 'Welcome to api!' };

app.get('/api', (req, res) => {
  res.send(greeting);
});

export default app;
