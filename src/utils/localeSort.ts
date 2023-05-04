export default function localeSort(data: string[]): string[] {
  return data.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}
