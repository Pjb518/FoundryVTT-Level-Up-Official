export interface SpellBookData {
  _id: string;
  name: string;
  slug: string;

  attribute: string;
  preparedType: string;
  spellIds: string[];
}

export interface SpellBookStats {
  ability: string;
  casterType: string;
  dc: number;
  progressionDivisor: number;
}
