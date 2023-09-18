export default function getCraftingComponentsLabel(item) {
  return item?.system?.craftingComponents ?? null;
}
