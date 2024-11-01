import { localize } from '#runtime/util/i18n';

export default function getMaterialPropertiesSummary(item) {
  const { flaws, materialProperties } = CONFIG.A5E;

  return item.system.materialProperties.map((property) => {
    if (property === 'flaw') {
      const flawTypes = item.system.flaws
        ?.map((flaw) => localize(flaws[flaw]) ?? null)
        ?.filter(Boolean)
        ?.sort((a, b) => a.localeCompare(b));

      if (!flawTypes.length) return materialProperties.flaw;

      return localize(
        'A5E.MaterialPropertyFlawSpecific',
        { type: flawTypes.join(', ') }
      );
    }

    return materialProperties[property] ?? property;
  });
}
