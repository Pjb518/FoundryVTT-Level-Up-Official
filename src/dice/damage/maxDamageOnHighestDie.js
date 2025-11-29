export default async function maximizeHighestDie(baseRoll) {
    const maxRoll = baseRoll.clone();

    let highestDie = null;
    let highestRollTermIndex = -1;

    // Find the highest die in the roll
    maxRoll.terms.forEach((term, idx) => {
        if (term instanceof foundry.dice.terms.Die) {

            if (!highestDie || term.faces > highestDie.faces) {
                highestDie = term;
                highestRollTermIndex = idx; // Track index of the highest die
            }
        }
    });

    // If no dice are present in the roll, return the original roll terms
    if (!highestDie) {
        return baseRoll.terms;
    }

    // If the highest die has more than 1 instance, reduce its count and add a maximized value to the end
    if (highestDie.number > 1) {
        // Reduce the number of dice in the original term
        maxRoll.terms[highestRollTermIndex] = new foundry.dice.terms.Die({
            number: highestDie.number - 1,
            faces: highestDie.faces,
            options: highestDie.options,
        });

        // Add the maximized value as a new term at the end
        const maxValue = highestDie.faces;
        maxRoll.terms.push(new foundry.dice.terms.OperatorTerm({ operator: '+' }));
        maxRoll.terms.push(new foundry.dice.terms.NumericTerm({ number: maxValue })); // Add a static term for max value
     } else {
         // If there's only one die in the term, replace it with its maximized value
         const maxValue = highestDie.faces;
         maxRoll.terms[highestRollTermIndex] = new foundry.dice.terms.NumericTerm({ number: maxValue });
     }

    await maxRoll.evaluate();

    return maxRoll.terms;
}