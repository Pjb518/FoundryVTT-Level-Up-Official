export interface BaseItemSystemSource {
  actions: Record<string, any>; // TODO: Update this
  description: string;
  favorite: boolean;
  secretDescription: string;
  source: string;
  uses: {
    value: number;
    max: string;
    per: string;
    recharge: {
      formula: string;
      threshold: number;
    }
  }
}

export interface ArchetypeSystemSource extends BaseItemSystemSource {
  slug: string;
  class: string;
  description: string;
  grants: Record<string, any>;
  resources: Record<string, any>;
  source: string;
  spellcasting: {
    ability: {
      base: string;
      options: string[];
      value: string;
    };
    casterType: string;
  };
}

export interface BackgroundSystemSource extends BaseItemSystemSource {
  grants: Record<string, any>;
  schemaVersion: any; // TODO: Update this
}

export interface ClassSystemSource extends BaseItemSystemSource {
  slug: string;
  classLevels: number;
  hp: {
    hitDiceSize: number;
    hitDiceUsed: number;
    levels: Record<number, number>;
  };
  // TODO: Types - Grants
  grants: any;
  resources: any;
  spellcasting: {
    ability: {
      base: string;
      options: string[];
      value: string;
    };
    casterType: string;
  };
  wealth: string;
}

export interface ClassCastingData {
  casterType: string;
  charges?: number;
  inventions?: number;
  maxLevel?: number;
  multiclassMode?: 'ADD';
  points?: number;
  progressionType: 'multiplier' | 'reference';
  resource: 'slots' | 'points' | 'inventions' | 'artifactCharges';
  slots?: Record<number, number>;
}

export interface CultureSystemSource extends BaseItemSystemSource {
  grants: Record<string, any>;
  schemaVersion: any; // TODO: Update this
}

export interface DestinySystemSource extends BaseItemSystemSource {
  fulfillmentFeature: string;
  inspirationFeature: string;
  schemaVersion: any; // TODO: Update this
  sourceOfInspiration: string;
}

export interface FeatureSystemSource extends BaseItemSystemSource {
  classes: string;
  concentration: boolean;
  featureType: string;
  grants: Record<string, any>;
  prerequisite: string;
  requiresBloodied: boolean;
}

export interface HeritageSystemSource extends BaseItemSystemSource {
  grants: Record<string, any>;
  schemaVersion: any; // TODO: Update this
}

export interface ObjectSystemSource extends BaseItemSystemSource {
  ammunitionProperties: string[];
  armorCategory: string;
  armorProperties: string[];
  attuned: boolean;
  bulky: boolean;
  breakerProperties: string[];
  capacity: {
    type: 'bulk' | 'count' | 'weight';
    value: number;
    weightlessContents: boolean;
  };
  containerId: string;
  craftingComponents: string;
  damagedState: number; // TODO: Enum
  defensiveProperties: string[];
  equippedState: number; // TODO: Enum
  flaws: string[];
  items: Record<string, any>; // TODO: Update this
  materialProperties: string[];
  mounted: string[];
  objectType: string;
  plotItem: boolean;
  price: string;
  proficient: boolean;
  quantity: number;
  rarity: string;
  requiresAttunement: boolean;
  shieldCategory: string;
  shieldProperties: string[];
  unidentified: boolean;
  unidentifiedDescription: string;
  unidentifiedName: string;
  versatile: string;
  weaponProperties: string[];
  weight: number;
}

export interface SpellSystemSource extends BaseItemSystemSource {
  classes: string[];
  components: {
    material: boolean;
    seen: boolean;
    vocalized: boolean;
  };
  concentration: boolean;
  level: number;
  materials: string;
  materialsConsumed: boolean;
  prepared: number; // TODO: Enum
  prerequisite: string;
  rare: boolean;
  ritual: boolean;
  schools: {
    primary: string;
    secondary: string[];
  }
  spellBook: string;
}

export type ItemSystemSource = BackgroundSystemSource
  | ClassSystemSource
  | CultureSystemSource
  | DestinySystemSource
  | FeatureSystemSource
  | HeritageSystemSource
  | ObjectSystemSource
  | SpellSystemSource;
