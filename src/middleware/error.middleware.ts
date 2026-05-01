import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  console.error("Unexpected Error:", err);

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}