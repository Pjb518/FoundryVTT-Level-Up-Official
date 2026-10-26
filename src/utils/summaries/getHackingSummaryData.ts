// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function getHackingSummaryData(item: ActionItem, options: Record<string, any>) {
	const diceCost = item.system.diceCost
		? `(${item.system.diceCost} ${_loc(
				item.system.diceCost > 1 ? 'A5E.hacking.diePlural' : 'A5E.hacking.die',
			)})`
		: '';

	return { hackingProperties: diceCost };
}
