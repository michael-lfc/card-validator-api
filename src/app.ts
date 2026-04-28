import express from "express";
import cardRoutes from "./routes/card.routes";
import { errorHandler } from "./middleware/error.middleware"

const app = express();

app.use(express.json());

app.use("/api/card", cardRoutes);

app.use(errorHandler);

export default app;