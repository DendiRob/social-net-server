import type { Express } from 'express';
import bodyParser from 'body-parser';

export default function (app: Express) {
  app.use(bodyParser.json({ limit: '10mb' }));
}
