/** Format a number as Indian Rupees, e.g. 118400 -> "₹1,18,400". */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
