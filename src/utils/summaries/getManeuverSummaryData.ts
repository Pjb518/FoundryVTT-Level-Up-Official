import type { ItemA5e } from '../../documents/item/item';

import { localize } from '#runtime/svelte/helper';

export default function getManeuverSummaryData(item: ItemA5e, options: Record<string, any>) {
  if (!item.isType('maneuver')) {
    return { maneuverProperties: '' };
  }

  const maneuverDegree = CONFIG.A5E.maneuverDegrees[item.system.degree];
  const tradition = CONFIG.A5E.maneuverTraditions[item.system.tradition] ?? '';
  const stance = item.system.isStance ? 'Stance' : '';

  const exertionCost = item.system.exertionCost ? `(${item.system.exertionCost}
    ${localize(item.system.exertionCost > 1 ? 'A5E.ExertionPointPlural' : 'A5E.ExertionPoint')})` : '';

  const maneuverProperties = [
    maneuverDegree,
    tradition,
    stance,
    exertionCost
  ].filter(Boolean).join(' ');

  return { maneuverProperties };
}
