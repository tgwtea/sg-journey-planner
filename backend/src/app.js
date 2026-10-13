import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

// The Express app. It does not call listen().
// server.js (local) and api/index.js (Vercel) both use this app.
const app = express();

app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
