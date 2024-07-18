export default function formulaIsClassResource(formula: string): boolean {
  if (formula.includes('@classResources.')) return true;
  return false;
}
