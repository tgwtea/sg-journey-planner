import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

// Local development entry point only. Vercel uses api/index.js.
connectDB().catch((err) => console.error('[db] Connection failed:', err.message));

app.listen(env.port, () => {
  console.log(`[api] Listening on http://localhost:${env.port}/api`);
});
