import compression from 'compression';
import type { Express } from 'express';

export default function (app: Express) {
  app.use(
    compression({
      filter: (req, res) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (req.headers['x-no-compression']) {
          // don't compress responses with this request header
          return false;
        }

        // fallback to standard filter function
        return compression.filter(req, res);
      }
    })
  );
}
