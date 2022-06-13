export default function calculateInventoryWeight(actorData) {
  const equippedItems = actorData.items.filter(item => item.data.equipped);

  const totalItemWeight = equippedItems.reduce((acc, curr) => {
    let itemWeight;

    try {
      itemWeight = Number(curr.data.weight.match(/\d?\.?\d/)[0]);
    } catch {
      return acc;
    }

    return acc + itemWeight;
  }, 0);

  const coinWeight = Object.values(actorData.data.currency).reduce((acc, curr) => acc + Number(curr), 0);

  return totalItemWeight + (coinWeight * 0.02);
}
