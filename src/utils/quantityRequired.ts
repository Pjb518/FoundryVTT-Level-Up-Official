export default function quantityRequired(items: any[]): boolean {
  return [...items].some((item) => item.type === 'object');
}
