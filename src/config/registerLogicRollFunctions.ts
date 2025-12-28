// @ts-nocheck
export default function registerLogicRollFunctions() {
  // Comparison operators
  Math.eq = (a, b) => a === b ? 1 : 0;
  Math.ne = (a, b) => a !== b ? 1 : 0;
  Math.gt = (a, b) => a > b ? 1 : 0;
  Math.gte = (a, b) => a >= b ? 1 : 0;
  Math.lt = (a, b) => a < b ? 1 : 0;
  Math.lte = (a, b) => a <= b ? 1 : 0;

  // Logical operators
  Math.not = (a) => a ? 0 : 1;
  Math.and = (...args) => args.every(arg => arg) ? 1 : 0;
  Math.or = (...args) => args.some(arg => arg) ? 1 : 0;

  // Conditional selection
  Math.pick = (condition, thenValue = 1, otherwiseValue = 0) => {
    return condition ? thenValue : otherwiseValue;
  };
  Math.unless = (condition, thenValue = 1, otherwiseValue = 0) => {
    return condition ? otherwiseValue : thenValue;
  };

  console.log('A5e | Logic roll functions registered');
}
