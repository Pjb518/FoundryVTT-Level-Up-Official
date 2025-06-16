import { getExpertiseDieSize } from "#utils/getExpertiseDieSize.ts";

export async function toggleExpertiseDice(
  message,
  rolls,
  rollIndex,
  expertiseDice,
) {
  const { rollData } = message?.system ?? {};
  const [originalRoll, originalRollData] = rolls[rollIndex];
  const originalExpertiseDice = originalRollData.expertiseDice;

  if (originalExpertiseDice === expertiseDice) return;

  const newRoll = new Roll(
    originalRoll.formula,
    { ...originalRoll.data },
    { ...originalRoll.options },
  );

  newRoll.terms = [...originalRoll.terms];

  const expertiseDieIndex = newRoll.terms.findIndex(
    (term) => term.options?.flavor === "Expertise Die",
  );

  const expertiseDie =
    expertiseDieIndex !== -1 ? newRoll.terms[expertiseDieIndex] : null;

  // If the current roll already has an expertise die as part of the roll, log the
  // result so that we can reuse it if the expertise die is changed back to the
  // original type.
  if (expertiseDie) {
    rollData[rollIndex].expertiseDiceResults ??= {};
    rollData[rollIndex].expertiseDiceResults[originalExpertiseDice] ??=
      newRoll.terms[expertiseDieIndex]?.results[0]?.result;
  }

  // If the user is removing expertise dice from the roll, remove both the die and
  // the preceding operator term.
  if (!expertiseDice) {
    newRoll.terms.splice(expertiseDieIndex - 1, 2);
  }

  // If the current roll has no expertise dice, append a new expertise die to the
  // roll terms alone with a + operator; Otherwise, replace the current expertise
  // die roll with a new one, using previously stored results if available.
  else {
    const newExpertiseDieRoll = new foundry.dice.terms.Die({
      number: 1,
      faces: parseInt(getExpertiseDieSize(expertiseDice).slice(2), 10),
      options: {
        flavor: "Expertise Die",
      },
    });

    const pastResults = rollData[rollIndex].expertiseDiceResults ?? {};

    if (pastResults[expertiseDice]) {
      newExpertiseDieRoll.results.push({
        active: true,
        result: pastResults[expertiseDice],
      });

      newExpertiseDieRoll._evaluated = true;
    } else {
      await newExpertiseDieRoll.evaluate();
    }

    if (!originalExpertiseDice) {
      newRoll.terms.push(
        new foundry.dice.terms.OperatorTerm({ operator: "+" }),
        newExpertiseDieRoll,
      );
    } else {
      newRoll.terms.splice(expertiseDieIndex, 1, newExpertiseDieRoll);
    }

    if (game.modules?.get("dice-so-nice")?.active) {
      // @ts-expect-error
      game.dice3d.showForRoll(
        Roll.fromTerms([newExpertiseDieRoll]),
        game.users.get(message.user.id),
        true,
        message.whisper,
        message.blind,
        null,
        message.speaker,
      );
    }
  }

  // Update the formula and total information for the new roll and evaluate the roll
  newRoll._formula = Roll.getFormula(newRoll.terms);
  newRoll._total = newRoll._evaluateTotal();
  await newRoll.evaluate();

  message.rolls.splice(rollIndex, 1, newRoll);
  rollData[rollIndex].expertiseDice = expertiseDice;

  await message.update({
    rolls: message.rolls,
    "system.rollData": rollData,
  });
}
