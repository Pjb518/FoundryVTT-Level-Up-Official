// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function getJourneyActivitySummaryData(
	item: ActionItem,
	options: Record<string, any>,
) {
	const summaryData: {
		criticalFailure?: string;
		failure?: string;
		success?: string;
		criticalSuccess?: string;
	} = {};

	const isGM = game.user?.isGM;

	if (item.type === 'interaction' && item.system.interactionType === 'journey' && isGM) {
		summaryData.criticalFailure = item.system.journeyProperties.criticalFailure;
		summaryData.failure = item.system.journeyProperties.failure;
		summaryData.success = item.system.journeyProperties.success;
		summaryData.criticalSuccess = item.system.journeyProperties.criticalSuccess;
	}

	return summaryData;
}
