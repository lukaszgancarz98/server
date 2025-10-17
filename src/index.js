import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRouter from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import errorHandling from './middlewares/errorHandler.js';
import workShopRouter from './routes/workShopRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors());

//Routes
app.use('/apim', userRouter);
app.use('/apim/product', productRoutes);
app.use('/apim/order', orderRouter);
app.use('/apim/workshop', workShopRouter);
app.set('trust proxy', true);

// Error handling
app.use(errorHandling);

//Server running
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
