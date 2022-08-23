export default function actionHasAttackRoll(action) {
  return Object.values(action.rolls).some((roll) => roll.type === 'attack');
}
