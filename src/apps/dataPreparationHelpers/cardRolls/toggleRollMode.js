export default async function toggleRollMode(message, rolls, rollIndex, rollMode) {
	const [originalRoll, originalRollData] = rolls[rollIndex];
	const originalRollMode = originalRollData.rollMode;

	if (originalRollMode === rollMode) return;

	const newRoll = new Roll(
		originalRoll.formula,
		{ ...originalRoll.data },
		{ ...originalRoll.options },
	);

	newRoll.terms = [...originalRoll.terms];

	const d20Term = newRoll.terms[0];
	const originalResultsLength = d20Term.results.length;

	// If there isn't a secondary d20 result in the message rollData, store the
	// secondary die result for the current die if available.
	if (d20Term.number === 2) {
		const secondDieResult = d20Term.results[1].result;
		message.system.rollData[rollIndex].secondDieResult ??= secondDieResult;
	}

	// Remove kh and kl modifiers
	d20Term.modifiers = d20Term.modifiers.filter((modifier) => !['kh', 'kl'].includes(modifier));

	if (!rollMode) {
		// Set the number of dice to 1 and keep only the first die
		d20Term.number = 1;
		d20Term.results = [d20Term.results.shift()];
	} else {
		// Add a kh modifier for advantage and a kl modifier for disadvantage
		d20Term.modifiers.push(rollMode === 1 ? 'kh' : 'kl');

		// Add a second die if there isn't one already
		if (!originalRollMode) {
			d20Term.number = 2;

			const { secondDieResult } = message?.system?.rollData?.[rollIndex] ?? undefined;

			// If a secondary d20 roll exists in the rollData, use that; otherwise,
			// generate a new result.
			if (secondDieResult) {
				d20Term.results.push({ result: secondDieResult });
			} else {
				await d20Term.roll();
			}
		}
	}

	// Reset all the metadata for the new d20Term results
	d20Term.results.forEach((term) => {
		term.active = true;
		delete term.discarded;
		delete term.indexThrow;
	});

	d20Term._evaluateModifiers();

	// Update the formula and total information for the new roll and evaluate the roll
	newRoll._formula = Roll.getFormula(newRoll.terms);
	newRoll._total = newRoll._evaluateTotal();
	await newRoll.evaluate();

	if (game.modules.get('dice-so-nice')?.active && d20Term.results.length > originalResultsLength) {
		const fakeD20Roll = Roll.fromTerms([foundry.dice.terms.RollTerm.fromData(d20Term.toJSON())]);

		fakeD20Roll.terms[0].number = fakeD20Roll.terms[0].results.length;
		fakeD20Roll.terms[0].results = fakeD20Roll.terms[0].results.filter((_, index) => index > 0);

		game.dice3d.showForRoll(
			fakeD20Roll,
			game.users.get(message.user.id),
			true,
			message.whisper,
			message.blind,
			null,
			message.speaker,
		);
	}

	// Replace the old roll with the new one in the message rolls array
	message.rolls.splice(rollIndex, 1, newRoll);

	// Update the corresponding rollData object
	message.system.rollData[rollIndex].rollMode = rollMode;

	// Permanently update the message with the new data
	await message.update({
		rolls: message.rolls,
		'system.rollData': message.system.rollData,
	});
}
