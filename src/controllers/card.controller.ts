import { Request, Response, NextFunction } from "express";
import { validateCardNumber } from "../services/card.service";
import { AppError } from "../middleware/error.middleware";
import { CardValidationResponse } from "../types";

export async function validateCard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { cardNumber } = req.body;

    if (cardNumber === undefined || cardNumber === null) {
      throw new AppError(400, "cardNumber is required");
    }

    if (typeof cardNumber !== "string" && typeof cardNumber !== "number") {
      throw new AppError(400, "cardNumber must be a string or number");
    }

    const cardStr = String(cardNumber).trim();

    if (cardStr.length === 0) {
      throw new AppError(400, "cardNumber must not be empty");
    }

    const isValid = validateCardNumber(cardStr);

    const response: CardValidationResponse = {
      success: true,
      cardNumber: cardStr,
      valid: isValid,
      message: isValid
        ? "Card number is valid"
        : "Card number is invalid",
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}