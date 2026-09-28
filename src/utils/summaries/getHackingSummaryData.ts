import { localize } from '#utils/localization/localize.ts';
import type { ItemA5e } from '../../documents/item/item';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function getHackingSummaryData(item: ItemA5e, options: Record<string, any>) {

	const diceCost = item.system.diceCost
		? `(${item.system.diceCost} ${localize(
				item.system.diceCost > 1 ? 'A5E.hacking.diePlural' : 'A5E.hacking.die',
			)})`
		: '';

	return { hackingProperties: diceCost };
}
