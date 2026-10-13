import 'dotenv/config';

// One place to read environment variables.
// Import `env` instead of reading process.env across the codebase.
export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  mongodbUri: process.env.MONGODB_URI || '',
  ltaAccountKey: process.env.LTA_ACCOUNT_KEY || '',
  dataGovSgApiKey: process.env.DATA_GOV_SG_API_KEY || '',
};
