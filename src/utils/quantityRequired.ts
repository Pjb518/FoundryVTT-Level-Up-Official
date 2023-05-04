export default function quantityRequired(items: array): array {
  return [...items].some((item) => item.type === 'object');
}
