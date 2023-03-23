import prepareSpellConsumer from './prepareSpellConsumer';

const consumerHandlerMap = {
  spell: prepareSpellConsumer
};

export default function prepareConsumers(consumers) {
  const consumersByType = Object.entries(consumers ?? {}).reduce((acc, [key, consumer]) => {
    acc[consumer.type] ??= [];
    acc[consumer.type].push([key, consumer]);

    return acc;
  }, {});

  return Object.entries(consumersByType).reduce((acc, [consumerType, _consumers]) => {
    if (typeof consumerHandlerMap[consumerType] === 'function') {
      acc[consumerType] = consumerHandlerMap[consumerType](_consumers) ?? [];
    }

    return acc;
  }, {});
}
