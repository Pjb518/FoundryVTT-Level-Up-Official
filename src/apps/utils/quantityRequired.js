export default function quantityRequired(items) {
  return [...items].some((item) => item.type === 'object');
}
