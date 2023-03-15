export default function calculateInventoryWeight(actorData) {
  const equippedItems = actorData.items.filter((item) => item.system.equipped);

  const totalItemWeight = equippedItems.reduce((acc, curr) => {
    const { quantity } = curr.system;
    const itemWeight = curr.system.weight ?? 0;

    return acc + (quantity ? itemWeight * quantity : itemWeight);
  }, 0);

  const coinWeight = Object.values(actorData.system.currency).reduce(
    (acc, curr) => acc + Number(curr),
    0
  );

  const trackCurrencyWeight = actorData.flags?.a5e?.trackCurrencyWeight ?? game.settings.get('a5e', 'currencyWeight');

  return trackCurrencyWeight ? totalItemWeight + (coinWeight * 0.02) : totalItemWeight;
}
