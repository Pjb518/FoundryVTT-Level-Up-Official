const operatorFunctions = {
  '==': (current, comparValue) => current === comparValue,
  '!=': (current, comparValue) => current !== comparValue,
  '>=': (current, comparValue) => current >= comparValue,
  '<=': (current, comparValue) => current <= comparValue,
  '>': (current, comparValue) => current > comparValue,
  '<': (current, comparValue) => current < comparValue
};

export default function evaluateConditional(
  current: number,
  operator: string,
  comparValue: number,
  trueValue: number,
  falseValue: number
) {
  if (!current && current !== 0) return current;

  const operatorFunction = operatorFunctions[operator];
  const resultType = operatorFunction(current, comparValue);

  if (resultType) return trueValue;
  return falseValue;
}
