export function weightRequired(items: any[], showWeightColumnFlag: number): boolean {
    if (showWeightColumnFlag === 0) return false;
    if (!items.some((item) => item?.system?.weight)) return false;
    if (showWeightColumnFlag === 1) return true;

    if (showWeightColumnFlag === 2) {
      return items.some(
          (item) =>
              item.system.objectType === "container" &&
              item.system.containerSortMethod === "weight",
      );
    }

    return false;
}
