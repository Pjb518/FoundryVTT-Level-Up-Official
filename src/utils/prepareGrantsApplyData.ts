import type { Grant } from '#data/item/Grants/GrantsField.ts';
import type { ActorGrantsManager } from '#managers/ActorGrantsManager.ts';

export default function prepareApplyData(
	actor: Character,
	grants: { id: string; grant: Grant }[],
	applyData: Map<string, any>,
) {
	const updateData: Record<string, any> = {};
	const itemUpdateData: any[] = [];
	const documentData: Map<string, ActorGrantsManager.DocumentData[]> = new Map();

	grants.forEach(({ id, grant }) => {
		const inputData = applyData.get(id);

		// Get granted features
		if (grant.type === 'feature') {
			const { appliedData, updateData: data } = grant.getApplyData(actor, inputData);
			const uuids: string[] =
				inputData?.uuids ?? grant.config.features.base.map(({ uuid }) => uuid) ?? [];

			const temp = uuids.map((uuid) => ({ uuid, type: 'feature' as const }));
			documentData.set(grant.fullId, temp);

			foundry.utils.mergeObject(updateData, data ?? {});
			itemUpdateData.push(appliedData);
			return;
		}

		// Get granted items
		if (grant.type === 'item') {
			const { appliedData, updateData: data } = grant.getApplyData(actor, inputData);
			const uuids: string[] =
				inputData?.uuids ?? grant.config.items.base.map(({ uuid }) => uuid) ?? [];

			// Get quantity overrides from the grant
			const allOptions = [...grant.config.items.base, ...grant.config.items.options];
			const temp = allOptions.reduce((acc, { uuid, quantityOverride }) => {
				if (!uuids.includes(uuid)) return acc;

				acc.push({ uuid, type: 'object' as const, quantity: quantityOverride });
				return acc;
			}, [] as ActorGrantsManager.DocumentData[]);

			documentData.set(grant.fullId, temp);
			foundry.utils.mergeObject(updateData, data ?? {});
			itemUpdateData.push(appliedData);

			return;
		}

		const { appliedData, updateData: grantUpdates } = grant.getApplyData(actor, inputData ?? {});

		// Manually merge arrays from updateData
		Object.entries(grantUpdates ?? {}).forEach(([key, value]) => {
			if (!Array.isArray(value)) return;

			const originalValue = (foundry.utils.getProperty(updateData, key) as string[]) ?? [];
			const newValue = [...new Set([...originalValue, ...(value as any[])])];
			grantUpdates[key] = newValue;
		});

		foundry.utils.mergeObject(updateData, grantUpdates);
		itemUpdateData.push(appliedData);
	});

	return { updateData, documentData, itemUpdateData };
}
