import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

import userRouter from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import errorHandling from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors());

//Routes
app.use("/api", userRouter);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRouter);
app.set("trust proxy", true)

// Error handling
app.use(errorHandling);

//Server running
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});