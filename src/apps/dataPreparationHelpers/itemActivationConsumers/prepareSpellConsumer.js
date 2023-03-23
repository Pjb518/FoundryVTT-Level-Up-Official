export default function prepareSpellConsumer(consumers) {
  if (!consumers.length) return [];

  const [key, consumer] = consumers[0];

  return [[key, consumer]];
}
