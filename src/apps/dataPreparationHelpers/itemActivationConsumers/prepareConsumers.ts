import type {
  ActionUsesConsumerData, HitDiceConsumerData, ItemUsesConsumerData, SpellConsumerData
} from '../../../dataModels/item/actions/ActionConsumersDataModel';
import type { ItemA5e } from '../../../documents/item/item';

export interface ConsumerHandlerReturnType {
  actionUses: [string, ActionUsesConsumerData][],
  hitDice: [string, HitDiceConsumerData][],
  itemUses: [string, ItemUsesConsumerData][],
  spell: [string, SpellConsumerData][]
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function _prepareConsumers(consumers: [string, any][]): [string, any][] {
  if (!consumers.length) return [];

  const [key, consumer] = consumers[0];
  return [key, consumer];
}

export default function prepareConsumers(
  item: ItemA5e,
  actionId: string
): ConsumerHandlerReturnType {
  const { consumers } = item.actions.get(actionId)!;

  const consumersByType = Object.entries(consumers ?? {}).reduce((acc, [key, consumer]) => {
    acc[consumer.type] ??= [];
    acc[consumer.type].push([key, consumer]);

    return acc;
  }, {});

  return Object.entries(consumersByType).reduce((acc, [consumerType, _consumers]) => {
    acc[consumerType] = _prepareConsumers(_consumers as any) ?? [];

    return acc;
  }, {} as ConsumerHandlerReturnType);
}
