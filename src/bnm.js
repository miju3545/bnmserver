import express from 'express';

import ogs from 'open-graph-scraper';
import { PORT, DB_HOST, DB_PASS } from '../config.js';
import { hello, api, apiParams } from './routes/api.js';
import { setSessionAndCookie } from './utils/httpUtils.js';
import { Redis } from './utils/Redis.js';
import { allowHosts } from './utils/httpUtils.js';
import { createPool } from 'mysql2';

const app = express();
const redis = new Redis();

setSessionAndCookie(app, redis);
app.use(allowHosts);
app.use((req, res, next) => {});

const pool = createPool({
  host: DB_HOST,
  port: 3306,
  user: 'sico',
  password: DB_PASS,
  database: 'sesacdb',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

app.get('/', hello);

app.all('/ogscrapper', (req, res) => {
  if (AllowHosts.includes(req.headers.origin))
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  else res.header('Access-Control-Allow-Origin', AllowHosts[0]);
  // res.header('Access-Control-Allow-Origin', '*');

  res.header('Access-Control-Allow-Credentials', true); //ajax for diff domain
  // res.header(
  //   'Access-Control-Allow-Headers',
  //   'Origin, X-Requested-With, Content-Type, Accept, Authorization, SocketID'
  // );
  res.header('Access-Control-Allow-Headers', 'SocketID');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, PATCH, PUT, POST, DELETE, OPTIONS'
  );

  ogs({ url: req.query.url }).then(({ error, result }) => {
    if (error) return res.status(500).json({ message: error.message });
    // console.log('rrr>>', result);
    res.json(result);
  });
});

// app.get('/api/:appid/:version/:schemas', );
app.all('/api/:appid/:version/:schemas/:idcmd', api);

app.all('/apiparams/:appid/:version/:schemas/:idcmd', apiParams);

app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// console.log('meta>>', import.meta.url);
const server = app.listen(PORT, () => {
  console.log(`B&M Server listening on port ${PORT}`);
});

export { server };
