import type ObjectItemA5e from '../../documents/item/object';

export default function getShieldProperties(item: ObjectItemA5e) {
  const { shieldProperties } = CONFIG.A5E;

  return item.system.shieldProperties.map(
    (property) => shieldProperties[property] ?? property
  ) as string[];
}
