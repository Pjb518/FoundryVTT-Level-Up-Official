export default function calculateInventoryWeight(actor) {
  const actorData = actor.system;
  const equippedItems = actor.items.filter((item) => item.system.equipped);

  const totalItemWeight = equippedItems.reduce((acc, curr) => {
    const { quantity } = curr.system;
    const itemWeight = parseFloat(curr.system.weight || 0, 10) ?? 0;

    return acc + (quantity ? itemWeight * quantity : itemWeight);
  }, 0);

  const coinWeight = Object.values(actorData.currency).reduce(
    (acc, curr) => acc + Number(curr),
    0
  );

  const excessSupplyWeight = 2 * Math.abs(
    Math.min(actorData.abilities.str.value - (actorData.supply ?? 0), 0)
  );

  const trackCurrencyWeight = actor.flags?.a5e?.trackCurrencyWeight ?? game.settings.get('a5e', 'currencyWeight');

  return trackCurrencyWeight
    ? totalItemWeight + excessSupplyWeight + (coinWeight * 0.02)
    : totalItemWeight + excessSupplyWeight;
}
