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

// // 404 middleware
// app.use((_req: Request, _res: Response, next: NextFunction) => {
//   const error = new Error('Not Found');
//   (error as any).status = 404;
//   next(error);
// });


// Global error handler
// app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
//   const { status = 500, message = 'Unknown error' } = err as any;
//   res.status(status).json({ error: message });
// });

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).json({ error: message||'Server Error' });
});



export default app;
