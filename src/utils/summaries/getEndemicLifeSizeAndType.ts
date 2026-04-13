import { localize } from '#utils/localization/localize.ts';
import type ObjectItemA5e from '../../documents/item/object.ts';

export default function getEndemicLifeProperties(item: ObjectItemA5e) {
	const {
        actorSizes,
        biomes,
        creatureTypes,
        endemicProperties,
        endemicTypes,
        regions,
    } = CONFIG.A5E;

  let summaryProperties: string[] = [];

  if (item.system.endemicLifeProperties.size) {
    if (item.system.endemicLifeProperties.creatureType) {
      summaryProperties.push(actorSizes[item.system.endemicLifeProperties.size] + " " + creatureTypes[item.system.endemicLifeProperties.creatureType]);
    } else if (item.system.endemicLifeProperties.type) {
      summaryProperties.push(actorSizes[item.system.endemicLifeProperties.size] + " " + localize(endemicTypes[item.system.endemicLifeProperties.type]));
    } else summaryProperties.push(actorSizes[item.system.endemicLifeProperties.size]);
  }

  const properties = item.system.endemicLifeProperties.properties.map(
		(property) => localize(endemicProperties[property]) ?? property,
	) as string[];

  properties.sort((a, b) => a.localeCompare(b));

  const biomeList = item.system.endemicLifeProperties.biomes.map(
		(biome) => localize(biomes[biome]) ?? biome,
	) as string[];

  const regionList = item.system.endemicLifeProperties.regions.map(
		(region) => localize(regions[region]) ?? region,
	) as string[];

  const locationList = [...biomeList, ...regionList];

  locationList.sort((a, b) => a.localeCompare(b));

	return [...summaryProperties, ...properties, ...locationList];;
}
