export default function evaluateMathExpression({expression, max = undefined, min = undefined, previousValue = 0}: {
    expression: string,
    max?: number | undefined,
    min?: number | undefined,
    previousValue?: number
}) {
    try {
        if (/[^0-9+\-]/.test(expression)) {
            return 0;
        }

        if (/^[+\-]/.test(expression)) {
            expression = `${previousValue}${expression}`; // Combine `value` with operator-prefixed input
        }

        let result = Math.floor(eval(expression)) as number;
        if (max !== undefined) {
            result = Math.min(result, max);
        }

        if (min !== undefined) {
            result = Math.max(result, min);
        }

        return result;

    } catch (error) {
        console.log('Invalid expression: ', error);
    }
}