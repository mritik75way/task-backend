import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import authRoutes from "./routes/auth.route";
import filesRouter from './routes/file.route'
import uploadRouter from './routes/upload.route'
import subscribeRouter from './routes/subscribe.route'
import { errorHandler } from "./middlewares/error.middleware";
import cookieParser from 'cookie-parser'
import { initWebPush } from "./config/webpush";

dotenv.config();
initWebPush();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,            
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use(cookieParser())
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRouter);
app.use("/api/files", filesRouter);
app.use("/api/notifications", subscribeRouter)
app.use(errorHandler);

export default app;