export interface CardValidationRequest {
  cardNumber: string | number;
}

export interface CardValidationResponse {
  success: boolean;
  cardNumber?: string;
  valid: boolean;
  message: string;
}