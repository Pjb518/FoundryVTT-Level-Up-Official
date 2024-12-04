import type {
	ActionUsesConsumerData,
	AmmunitionConsumerData,
	HitDiceConsumerData,
	ItemUsesConsumerData,
	QuantityConsumerData,
	ResourceConsumerData,
	SpellConsumerData,
} from '../../../dataModels/item/actions/ActionConsumersDataModel';
import type { ItemA5e } from '../../../documents/item/item';

export interface ConsumerHandlerReturnType {
	actionUses?: [string, ActionUsesConsumerData];
	ammunition?: [string, AmmunitionConsumerData];
	hitDice?: [string, HitDiceConsumerData];
	itemUses?: [string, ItemUsesConsumerData];
	quantity?: [string, QuantityConsumerData];
	resource?: [string, ResourceConsumerData][];
	spell?: [string, SpellConsumerData];
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function _prepareConsumers(consumers: [string, any][], consumerType: string): any[] {
	if (!consumers.length) return [];

	if (consumerType === 'resource') return consumers;

	const [key, consumer] = consumers[0];
	return [key, consumer];
}

export default function prepareConsumers(
	item: ItemA5e,
	actionId: string,
): ConsumerHandlerReturnType {
	const { consumers } = item.actions.get(actionId)!;

	const consumersByType = Object.entries(consumers ?? {}).reduce((acc, [key, consumer]) => {
		acc[consumer.type] ??= [];
		acc[consumer.type].push([key, consumer]);

		return acc;
	}, {});

	return Object.entries(consumersByType).reduce((acc, [consumerType, _consumers]) => {
		acc[consumerType] = _prepareConsumers(_consumers as any, consumerType) ?? [];

		return acc;
	}, {} as ConsumerHandlerReturnType);
}
