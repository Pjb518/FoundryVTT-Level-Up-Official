/**
 * A helper function for converting a cardinal number to an ordinal number.
 */
export default function getOrdinalNumber(n: number): string {
  const j = parseInt(n, 10) % 10;
  const k = parseInt(n, 10) % 100;

  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}
