import express from 'express';
import cors from 'cors';
import { WHITELIST } from './constants.js';
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

app.use(cookieParser());

//define routes
import healthCheckRoute from './routes/healthCheck.route.js';
import userRoute from './routes/user.route.js';
import categoryRoute from './routes/category.route.js';
import subcategoryRoute from './routes/subcategory.route.js';

app.use(healthCheckRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1', categoryRoute);
app.use('/api/v1', subcategoryRoute);
app.use(errorHandler);
export { app };
