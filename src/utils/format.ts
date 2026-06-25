/** Format a number as Indian Rupees, e.g. 118400 -> "₹1,18,400". */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Format a money amount with thousands separators and three decimals,
 * e.g. 1192.5 -> "1,192.500". Matches the web portal's OMR convention.
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}
