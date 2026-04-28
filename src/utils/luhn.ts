export function luhnCheck(cardNumber: string): boolean {
  // 1. Clean the input
  const digits = cardNumber.replace(/\s|-/g, "");

  if (!/^\d+$/.test(digits)) return false;
  if (digits.length < 13 || digits.length > 19) return false;

  // 2. Rule: which indices (from the left) should be doubled?
  const length = digits.length;
  const indexShouldBeDoubled = (i: number): boolean =>
    length % 2 === 0 ? i % 2 === 0 : i % 2 === 1;

  // 3. Sum all digits using the rule
  let sum = 0;
  for (let i = 0; i < length; i++) {
    let digit = parseInt(digits[i], 10);

    if (indexShouldBeDoubled(i)) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
  }

  // 4. Final check
  return sum % 10 === 0;
}