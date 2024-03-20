export interface SpellBookData {
  _id: string;
  name: string;
  slug: string;

  ability: string;
  preparedType: string;
}

export interface SpellBookStats {
  ability: string;
  dc: number;
  mod: number;
  mode: string;
  progressionDivisor: number;
}
