import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware";
import { authMiddleware } from "./middlewares/auth.middleware";
import featureRoutes from "./routes/feature.routes"
import adminRoutes from "./routes/admin.routes"
import authRoutes from './routes/auth.routes'

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(authMiddleware)

app.use('/api/features', featureRoutes)
app.use('/api/admin', adminRoutes)

app.use(errorHandler);

export default app;
