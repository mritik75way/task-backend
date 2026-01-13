import express from "express"
import cors from "cors"
import folderRoutes from "./routes/folder.routes"
import documentRoutes from "./routes/document.routes"
import versionRoutes from "./routes/version.routes"
import dotenv from "dotenv"
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config()

const app = express()

app.use(cors({
    origin: "http://localhost:3001",
}))
app.use(express.json())

app.use("/api/folders", folderRoutes)
app.use("/api/documents", documentRoutes)
app.use("/api/versions", versionRoutes)


app.use(errorHandler);


export default app
