export function generateExpandedChanges(changes) {
	const additionalChanges: any[] = [];
	const removalKeys: string[] = [];

	changes.forEach((change) => {
		if (!CONFIG.A5E.EXPANDED_EFFECTS.has(change.key)) return;

		/** --------------------------- */
		// Expertise Dice
		/** --------------------------- */
		if (change.key === 'flags.a5e.effects.expertiseDice.all') {
			const abilities = Object.keys(CONFIG.A5E.abilities);

			// Abl Checks
			abilities.forEach((abl) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.abilities.${abl}.check.expertiseDice`;
				additionalChanges.push(expandedChange);
			});

			// Abl Saves
			abilities.forEach((abl) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.abilities.${abl}.save.expertiseDice`;
				additionalChanges.push(expandedChange);
			});

			removalKeys.push(change.key);
		}

		if (change.key === 'flags.a5e.effects.expertiseDice.allChecks') {
			const abilities = Object.keys(CONFIG.A5E.abilities);

			abilities.forEach((abl) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.abilities.${abl}.check.expertiseDice`;
				additionalChanges.push(expandedChange);
			});

			removalKeys.push(change.key);
		}

		if (change.key === 'flags.a5e.effects.expertiseDice.allSaves') {
			const abilities = Object.keys(CONFIG.A5E.abilities);

			abilities.forEach((abl) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.abilities.${abl}.save.expertiseDice`;
				additionalChanges.push(expandedChange);
			});

			removalKeys.push(change.key);
		}

		/** --------------------------- */
		// Movement
		/** --------------------------- */
		if (change.key === 'flags.a5e.effects.movement.allDistances') {
			const movementTypes = Object.keys(CONFIG.A5E.movement);
			movementTypes.forEach((movementType) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.attributes.movement.${movementType}.distance`;
				additionalChanges.push(expandedChange);
			});

			removalKeys.push(change.key);
		}

		if (change.key === 'flags.a5e.effects.movements.allUnits') {
			const movementTypes = Object.keys(CONFIG.A5E.movement);
			movementTypes.forEach((movementType) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.attributes.movement.${movementType}.unit`;
				additionalChanges.push(expandedChange);
			});

			removalKeys.push(change.key);
		}

		/** --------------------------- */
		// Senses
		/** --------------------------- */
		if (change.key === 'flags.a5e.effects.senses.allSenses') {
			const senses = Object.keys(CONFIG.A5E.senses);
			senses.forEach((sense) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.attributes.senses.${sense}.value`;
				additionalChanges.push(expandedChange);
			});

			removalKeys.push(change.key);
		}

		if (change.key === 'flags.a5e.effects.senses.allUnits') {
			const senses = Object.keys(CONFIG.A5E.senses);
			senses.forEach((sense) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.attributes.senses.${sense}.unit`;
				additionalChanges.push(expandedChange);
			});

			removalKeys.push(change.key);
		}

		/** --------------------------- */
		// Roll Modes
		/** --------------------------- */
		if (change.key === 'flags.a5e.effects.rollMode.attack.all') {
			const attackTypes = Object.keys(CONFIG.A5E.attackTypes);
			attackTypes.forEach((type) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.rolls.attack.${type}.outgoing.rollMode`;
				additionalChanges.push(expandedChange);
			});

			removalKeys.push(change.key);
		}

		if (change.key === 'flags.a5e.effects.rollMode.abilityCheck.all') {
			const abilities = Object.keys(CONFIG.A5E.abilities);
			abilities.forEach((abl) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.abilities.check.${abl}.rollMode`;
				additionalChanges.push(expandedChange);
			});

			removalKeys.push(change.key);
		}

		if (change.key === 'flags.a5e.effects.rollMode.abilitySave.all') {
			const abilities = Object.keys(CONFIG.A5E.abilities);
			abilities.forEach((abl) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.abilities.save.${abl}.rollMode`;
				additionalChanges.push(expandedChange);
			});

			removalKeys.push(change.key);
		}

		if (change.key === 'flags.a5e.effects.rollMode.skillCheck.all') {
			const skills = Object.keys(CONFIG.A5E.skills);
			skills.forEach((skl) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.skills.${skl}.rollMode`;
				additionalChanges.push(expandedChange);
			});

			removalKeys.push(change.key);
		}

		/** --------------------------- */
		// Spell DC
		/** --------------------------- */
		if (change.key === 'system.attributes.spellDC') {
			const spellBookIds = Object.keys(change.effect.actor?.system?.spellBooks ?? {});
			spellBookIds.forEach((spellBookId) => {
				const expandedChange = foundry.utils.deepClone(change);
				expandedChange.key = `system.spellBooks.${spellBookId}.stats.dc`;
				additionalChanges.push(expandedChange);
			});
		}
	});

	removalKeys.forEach((key) => {
		const idx = changes.findIndex((c) => c.key === key);
		if (idx !== -1) changes.splice(idx, 1);
	});

	changes.push(...additionalChanges);
}
