export default function determineRollMode(original: number, override: number): number {
  // eslint-disable-next-line no-bitwise
  const cancels = (original ^ override) < -1;
  return cancels ? 0 : override;
}
