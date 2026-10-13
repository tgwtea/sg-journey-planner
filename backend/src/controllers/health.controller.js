import { dbStatus } from '../config/db.js';

export function getHealth(req, res) {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    database: dbStatus(),
  });
}
