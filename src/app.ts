import express from "express";
import cardRoutes from "./routes/card.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Global middleware
app.use(express.json());

// Routes
app.use("/api/card", cardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler - MUST be last
app.use(errorHandler);

export default app;