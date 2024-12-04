import type { ItemA5e } from '../../../documents/item/item';

export default function prepareEffectPrompts(item: ItemA5e, actionId: string) {
	const effectIds = item.actions.get(actionId)!.effects;

	const effects = effectIds.map((id) => item.effects.get(id));
	return [...effects].filter((e) => !!e);
}
