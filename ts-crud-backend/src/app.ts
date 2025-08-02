import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './routes/user.routes.js';
import createHttpError from 'http-errors';

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use('/api/users', userRoutes);

// 404 handler
app.use((_req, _res, next) => next(createHttpError(404, 'Not found')));

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).json({ error: message||'Server Error' });
});



export default app;
