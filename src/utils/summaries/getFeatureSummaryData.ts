export default function getFeatureSummaryData(
	item: ActionItem,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	options: Record<string, any>,
) {
	if (item.system.featureType !== 'followerFeature') return {};

	const { followerType, experienceType } = item.system;

	const type = followerType ? _loc(CONFIG.A5E.followerTypes[followerType]) : '';
	const experience = experienceType ? _loc(CONFIG.A5E.followerExperienceTypes[experienceType]) : '';

	return { featureProperties: type && experience ? `${type} (${experience})` : type || experience };
}
