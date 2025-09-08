import express from 'express';
import cors from 'cors';
import { ACCESS_TOKEN_SECRET, WHITELIST } from './constants.js';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.middleware.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(
  cors({
    origin: WHITELIST,
    credentials: true,
  })
);

app.use(cookieParser(ACCESS_TOKEN_SECRET));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: (req, res) => (req.user ? 100 : 10),
  standardHeaders: 'draft-8',
  legacyHeaders: true,
  message: 'To many requests from this IP,please try again after 15 minutes ',
  keyGenerator: req => req.ip,
});

app.use(limiter);
//define routes
import healthCheckRoute from './routes/healthCheck.route.js';
import userRoute from './routes/user.route.js';
import categoryRoute from './routes/category.route.js';
import subcategoryRoute from './routes/subcategory.route.js';
import rateLimit from 'express-rate-limit';

app.use('/api/v1', healthCheckRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1', categoryRoute);
app.use('/api/v1', subcategoryRoute);
app.use(errorHandler);
export { app };
