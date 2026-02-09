import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRouter from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import errorHandling from './middlewares/errorHandler.js';
import workShopRouter from './routes/workShopRoutes.js';
import casesRouter from './routes/casesRouter.js';
import coursesRouter from './routes/coursesRouter.js';
import recruitmentRouter from './routes/recruitmentRouter.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors());

//Routes
app.use('/api', userRouter);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRouter);
app.use('/api/workshop', workShopRouter);
app.use('/api/cases', casesRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/recruitment', recruitmentRouter);
app.set('trust proxy', true);

// Error handling
app.use(errorHandling);

//Server running
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
