export default async function displayCascadingNumbers(actor, category, value, type) {
  const token = await actor.getActiveTokens()?.[0];

  if (!token) return;

  const table = category === 'damage' ? 'damageColors' : 'healingColors';
  const fill = CONFIG.A5E[table]?.[type] ?? '#fff';

  canvas.interface.createScrollingText(token?.center, value, { fill });
}
