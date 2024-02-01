import express from 'express';

import { env } from '@/config/env.js';

import useCors from '@/config/cors.js';
import useRoutes from '@/routes/index.js';
import useBodyParser from '@/config/bodyParser.js';
import useCookieParser from '@/config/cookieParser.js';
import useCompression from '@/config/compression.js';

const app = express();

app.disable('x-powered-by');
app.use(express.static('public'));

useCors(app);
useCompression(app);
useBodyParser(app);
useCookieParser(app);
useRoutes(app);

// const server = createServer(app);
// socketIO(server);

const { HOST, PORT } = env;

app.listen(PORT, HOST, () => {
  console.log(`Listen ${HOST}:${PORT}...`);
});
