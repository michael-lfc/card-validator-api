export function luhnCheck(cardNumber: string): boolean {
  // Clean input: remove all spaces and dashes, then trim
  const cleaned = cardNumber.replace(/\s|-/g, "").trim();

  // Early validation
  if (!cleaned || !/^\d+$/.test(cleaned)) {
    return false;
  }

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  const digits = cleaned.split('').map(Number);
  let sum = 0;
  let shouldDouble = false;   // We start from the right (check digit is never doubled)

  // Process the digits from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;   // 10→1, 12→3, 14→5, etc. (sum of digits)
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;  // Toggle for next digit
  }

  return sum % 10 === 0;
}