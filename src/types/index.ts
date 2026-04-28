export interface CardValidationRequest {
  cardNumber: string | number;
}

export interface CardValidationResponse {
  valid: boolean;
  message: string;
}