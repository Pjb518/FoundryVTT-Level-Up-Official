export function formulaIsNamedResource(formula: string): boolean {
	if (formula.includes('@resource.')) return true;
	return false;
}
