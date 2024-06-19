export interface ClassSystemSource {
  slug: string;
  description: string;
  classLevels: number;
  hp: {
    hitDiceSize: number;
    hitDiceUsed: number;
    levels: Record<number, number>;
  };
  // TODO: Types - Grants
  grants: any;
  resources: any;
  source: string;
  spellcasting: {
    ability: {
      base: string;
      options: string[];
      value: string;
    };
    casterType: string;
    knownCantrips: Record<number, number>;
    knownSpells: Record<number, number>;
  };
  wealth: string;
}
