import type { Grant } from '#data/item/Grants/GrantsField.ts';
import type { ActorGrantsManager } from '#managers/ActorGrantsManager.ts';

export default function prepareApplyData(
	actor: Character,
	grants: { id: string; grant: Grant }[],
	applyData: Map<string, any>,
) {
	const updateData: Record<string, any> = {};
	const documentData: Map<string, ActorGrantsManager.DocumentData[]> = new Map();

	grants.forEach(({ id, grant }) => {
		const inputData = applyData.get(id);

		// Get granted features
		if (grant.type === 'feature') {
			const data = grant.getApplyData(actor, inputData);
			const uuids: string[] =
				inputData?.uuids ?? grant.config.features.base.map(({ uuid }) => uuid) ?? [];

			const temp = uuids.map((uuid) => ({ uuid, type: 'feature' as const }));
			documentData.set(id, temp);

			foundry.utils.mergeObject(updateData, data ?? {});
			return;
		}

		// Get granted items
		if (grant.type === 'item') {
			const data = grant.getApplyData(actor, inputData);
			const uuids: string[] =
				inputData?.uuids ?? grant.config.items.base.map(({ uuid }) => uuid) ?? [];

			// Get quantity overrides from the grant
			const allOptions = [...grant.config.items.base, ...grant.config.items.options];
			const temp = allOptions.reduce((acc, { uuid, quantityOverride }) => {
				if (!uuids.includes(uuid)) return acc;

				acc.push({ uuid, type: 'object' as const, quantity: quantityOverride });
				return acc;
			}, [] as ActorGrantsManager.DocumentData[]);

			documentData.set(id, temp);
			foundry.utils.mergeObject(updateData, data ?? {});

			return;
		}

		let grantUpdates: any;
		if (inputData) {
			grantUpdates = grant.getApplyData(actor, inputData);
		} else {
			grantUpdates = grant.getApplyData(actor, {});
		}

		// Manually merge arrays from updateData
		Object.entries(grantUpdates ?? {}).forEach(([key, value]) => {
			if (!Array.isArray(value)) return;

			const originalValue = (foundry.utils.getProperty(updateData, key) as string[]) ?? [];
			const newValue = [...new Set([...originalValue, ...(value as any[])])];
			grantUpdates[key] = newValue;
		});

		foundry.utils.mergeObject(updateData, grantUpdates);
	});

	return { updateData, documentData };
}
