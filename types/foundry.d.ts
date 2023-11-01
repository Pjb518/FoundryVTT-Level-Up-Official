/**
 * This file defines types for the various extensions Foundry makes to JS types
 */

interface Math {
  clamped(num: number, min: number, max: number): number
}

interface NumberConstructor {
  fromString(n: string): number;
}

interface String {
  capitalize(): string;
}
