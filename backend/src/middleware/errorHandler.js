import { env } from '../config/env.js';

// Central error handler. Every route error ends here.
// Set err.status in a service or controller to choose the HTTP code.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500 && status !== 501) console.error('[api]', err);

  res.status(status).json({
    error: {
      message: status === 500 && env.nodeEnv === 'production' ? 'Internal server error' : err.message,
      status,
    },
  });
}
