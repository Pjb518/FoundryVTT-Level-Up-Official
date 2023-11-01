type SkillKey = acr | ani | arc | ath | cul | dec | eng | his | ins | itm | inv | med | nat | prc
  | prf | per | rel | slt | ste | sur;

type Skill = {
  ability: AbilityScoreKey,
  value: number,
  proficient: boolean,
  specialties: string[],
  expertiseDice: number,
  minRoll: number,
  bonuses: {
    check: string,
    passive: number
  },
  mod: number,
  deterministicBonus: number,
  passive: number
};
