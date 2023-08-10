export default function calculateInventoryWeight(actor) {
  const { EQUIPPED_STATES } = CONFIG.A5E;
  const actorData = actor.system;
  const equippedItems = actor.items.filter(
    (item) => [EQUIPPED_STATES.EQUIPPED, EQUIPPED_STATES.CARRIED]
      .includes(item.system.equippedState)
  );

  const totalItemWeight = equippedItems.reduce((acc, curr) => {
    if (curr.system.containerId) {
      const container = equippedItems.find((i) => i.uuid === curr.system.containerId);
      if (!container) return acc;
    }

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
