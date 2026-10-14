import { localize } from '#utils/localization/localize.ts';
import type { ItemA5e } from '../../documents/item/item';

export default function getFeatureSummaryData(
	item: ItemA5e,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	options: Record<string, any>,
) {
	if (item.system.featureType !== 'followerFeature') return {};

	const { followerType, experienceType } = item.system;

	const type = followerType ? localize(CONFIG.A5E.followerTypes[followerType]) : '';
	const experience = experienceType
		? localize(CONFIG.A5E.followerExperienceTypes[experienceType])
		: '';

	return { featureProperties: type && experience ? `${type} (${experience})` : type || experience };
}
