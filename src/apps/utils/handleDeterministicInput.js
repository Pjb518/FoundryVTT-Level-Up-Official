import getDeterministicBonus from '../../dice/getDeterministicBonus';

export default function handleDeterministicInput(formula, rollData = {}) {
  try {
    getDeterministicBonus(formula, rollData);
  } catch (e) {
    ui.notifications.error('Invalid roll formula.');
    throw new Error('Invalid Roll Formula.');
  }
}
