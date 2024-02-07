/**
 * This file defines types for the various extensions Foundry makes to JS types
 */
interface Array<T> {
  deepFlatten(): T[];
  equals(other: T[]): boolean;
  filterJoin(sep: string): string;
  findSplice(find: (element: T) => boolean, replace?: T): T | null;
  fromRange(n: number): T[];
  partition(rule: (value: T) => number): [T, T];
}

interface Math {
  clamped(num: number, min: number, max: number): number
  normalizeDegrees(degrees: number): number;
  normalizeRadians(radians: number): number;
  toDegrees(angle: number): number;
  toRadians(degree: number): number;
}

interface Number {
  between(a: number, b: number, inclusive?: boolean): boolean;
  isNumeric(n: any): boolean;
  ordinalString(): string;
  paddedString(digits: number): string;
  signedString(): string;
}

interface NumberConstructor {
  fromString(n: string): number;
}

interface Set<T> {
  intersects(other: Set<T>): boolean;
  intersection(other: Set<T>): Set<T>;
  union(other: Set<T>): Set<T>;
  difference(other: Set<T>): Set<T>;
}

interface String {
  capitalize(): string;
  titleCase(): string;
  slugify(replacement?: string, strict: boolean): string;
  stripScripts(): string;
}
