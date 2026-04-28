import { luhnCheck } from "../utils/luhn";

export function validateCardNumber(cardNumber: string): boolean {
  return luhnCheck(cardNumber);
}