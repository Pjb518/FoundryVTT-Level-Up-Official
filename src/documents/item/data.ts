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

export interface RevitalizeOptions {
  nameMatch?: boolean;
  notify?: boolean;
  update?: boolean;
  updateEffects?: boolean;
  updateImg?: boolean;
  updateName?: boolean;
}

/** --------------------------------------- */
/** Roll Interfaces                         */
/** --------------------------------------- */
export interface ActionActivationOptions {
  skipRollDialog?: boolean;
}
