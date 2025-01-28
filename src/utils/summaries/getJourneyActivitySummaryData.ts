import type { ItemA5e } from '../../documents/item/item';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function getJourneyActivitySummaryData(item: ItemA5e, options: Record<string, any>) {
    // @ts-expect-error
    const summaryData: {
        criticalFailure?: string;
        failure?: string;
        success?: string;
        criticalSuccess?: string;
    } = {};

    const { interactionType } = item.system;

    let isGM = game.user.isGM;

    if (interactionType === 'journey' && isGM) {
        summaryData.criticalFailure = item.system.journeyProperties.criticalFailure;
        summaryData.failure = item.system.journeyProperties.failure;
        summaryData.success = item.system.journeyProperties.success;
        summaryData.criticalSuccess = item.system.journeyProperties.criticalSuccess;
    }

    return summaryData;
}