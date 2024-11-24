import { localize } from '#runtime/util/i18n';

export default function getMaterialPropertiesSummary(item) {
  const { flaws, materialProperties, modPorts } = CONFIG.A5E;

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
    } else if (property === 'spacefaring') {
        if (item.system.modPorts){
          if (item.system.modPorts != "1"){
            const modPort = modPorts[item.system.modPorts];

            return localize(
              'A5E.MaterialPropertySpacefaringSpecificPlural',
              { type: modPort }
            );

          } else {
            const modPort = modPorts[item.system.modPorts];

            return localize(
              'A5E.MaterialPropertySpacefaringSpecific',
              { type: modPort }
            );
          }
        } else { 
            return localize('A5E.MaterialPropertySpacefaring');
        } 
    }

    return materialProperties[property] ?? property;
  });
}
