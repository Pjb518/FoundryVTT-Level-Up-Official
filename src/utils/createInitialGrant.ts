import type { Grant } from '#data/item/Grants/GrantsField.ts';
import { ITEM_GRANT_TYPES } from '#data/item/Grants/index.ts';

export function createInitialGrant(type: keyof typeof ITEM_GRANT_TYPES, data: Record<string, any>) {
	const model = ITEM_GRANT_TYPES[type];
	if (!model) return {};

	const initial = model.schema.getInitialValue() as any;
	const newGrant: Grant = foundry.utils.mergeObject(initial, data ?? {}) as Grant;
	newGrant.grantType = type;

	const id = foundry.utils.randomID();
	newGrant.id = id;

	return { [id]: newGrant };
}
