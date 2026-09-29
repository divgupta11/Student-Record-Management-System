import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import connectDatabase from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import studentRoutes from './routes/studentRoutes.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(projectRoot, '.env') });

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '20kb' }));
app.get('/api/health', (_request, response) => {
  response.status(200).json({ success: true, message: 'Student API is running.' });
});
app.use('/api/students', studentRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => console.log(`Student API listening on port ${port}`));
  } catch (error) {
    console.error(`Could not start the API: ${error.message}`);
    process.exitCode = 1;
  }
}

startServer();