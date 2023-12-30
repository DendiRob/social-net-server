import type { Express } from 'express';
import cors from 'cors';

import { env } from './env.js';

export default function (app: Express) {
  if (env.NODE_ENV === 'production') {
    app.use(cors({ origin: env.CORS_PRODUCTION_MODE, credentials: true }));
  } else {
    app.use(
      cors({
        origin: function (origin, callback) {
          callback(null, true);
        },
        credentials: true
      })
    );
  }
}
