import type { Grant } from '#data/item/Grants/GrantsField.ts';
import type { ActorGrantsManager } from '#managers/ActorGrantsManager.ts';

export default async function prepareApplyData(
	actor: Character,
	grants: { id: string; grant: Grant }[],
	applyData: Map<string, any>,
) {
	const actorUpdates: Record<string, any> = {};
	const itemUpdateData: any[] = [];
	const documentData: Map<string, ActorGrantsManager.DocumentData> = new Map();

	await Promise.all(
		grants.map(async ({ id, grant }) => {
			const inputData = applyData.get(id);
			const { appliedData, documents, updateData } = await grant.getApplyData(
				actor,
				inputData ?? {},
			);

			// Manually merge arrays from updateData
			Object.entries(updateData ?? {}).forEach(([key, value]) => {
				if (!Array.isArray(value)) return;

				const originalValue = (foundry.utils.getProperty(actorUpdates, key) as string[]) ?? [];
				const newValue = [...new Set([...originalValue, ...(value as any[])])];
				updateData[key] = newValue;
			});

			foundry.utils.mergeObject(actorUpdates, updateData);

			// Add applied data that will update grants
			if (appliedData) itemUpdateData.push(appliedData);

			// Add document data
			if (documents?.length) {
				let type = grant.type as string;
				if (type === 'item') type = 'object';
				documentData.set(grant.fullId, { docs: documents, type });
			}
		}),
	);

	return {
		updateData: actorUpdates,
		documentData,
		itemUpdateData,
	};
}
