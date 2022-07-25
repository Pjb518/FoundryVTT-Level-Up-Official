export default function getRollModeFromEvent(event) {
  let rollMode;

  if (event.ctrlKey || event.metaKey) rollMode = 'disadvantage';
  else if (event.altKey) rollMode = 'advantage';

  return rollMode ? CONFIG.A5E.ROLL_MODE[rollMode.toUpperCase()] : null;
}
