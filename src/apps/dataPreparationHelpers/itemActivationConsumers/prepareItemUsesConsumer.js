export default function prepareItemUsesConsumer(consumers) {
  if (!consumers.length) return [];

  const [key, consumer] = consumers[0];

  return [[key, consumer]];
}
