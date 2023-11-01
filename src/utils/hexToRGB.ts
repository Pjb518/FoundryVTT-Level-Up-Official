export default function hexToRGB(hex: string, opacity: number = 1): string {
  let r: string;
  let g: string;
  let b: string;

  if (hex.length === 4) {
    r = `0x${hex[1]}${hex[1]}`;
    g = `0x${hex[2]}${hex[2]}`;
    b = `0x${hex[3]}${hex[3]}`;
  } else if (hex.length === 7) {
    r = `0x${hex[1]}${hex[2]}`;
    g = `0x${hex[3]}${hex[4]}`;
    b = `0x${hex[5]}${hex[6]}`;
  }

  return `rgb(${+r}, ${+g}, ${+b}, ${opacity})`;
}
