export function registerResourcesConfig() {
	const resourceGrantRecoveryOptions = {
		shortRest: 'A5E.rest.short',
		longRest: 'A5E.rest.long',
		round: 'A5E.durations.round',
		turn: 'A5E.durations.turn',
		minute: 'A5E.durations.minute',
		hour: 'A5E.durations.hour',
		day: 'A5E.durations.day',
		week: 'A5E.durations.week',
		month: 'A5E.durations.month',
		year: 'A5E.durations.year',
	};

	const diceResourceConsumeType = {
		none: 'None',
		number: 'Number',
		size: 'Size',
	};

	const diceResourceUseType = {
		decrement: 'Decrement',
		increment: 'Increment',
	};

	return {
		diceResourceConsumeType,
		diceResourceUseType,
		resourceGrantRecoveryOptions,
	};
}
