export default function prepareActionUsesConsumer(consumers) {
  if (!consumers.length) return [];

  const [key, consumer] = consumers[0];

  return [[key, consumer]];
}
