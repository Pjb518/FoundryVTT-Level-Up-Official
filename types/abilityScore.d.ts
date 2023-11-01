type AbilityScoreKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

type AbilityScore = {
  mod: number,
  value: number,
  check: {
    bonus: string,
    deterministicBonus: number,
    expertiseDice: number,
    mod: number
  },
  save: {
    bonus: string,
    deterministicBonus: number,
    expertiseDice: number,
    mod: number,
    proficient: boolean
  }
};
