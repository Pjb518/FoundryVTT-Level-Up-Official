export default function registerEffectGroupConfig() {
  const effectKeyGroups = {
    abilityChecks: {
      label: 'A5E.effects.groups.abilityChecks',
      items: [
        'flags.a5e.effects.rollMode.abilityCheck.all',
        'flags.a5e.effects.rollMode.abilityCheck.cha',
        'flags.a5e.effects.rollMode.abilityCheck.con',
        'flags.a5e.effects.rollMode.abilityCheck.dex',
        'flags.a5e.effects.rollMode.abilityCheck.int',
        'flags.a5e.effects.rollMode.abilityCheck.str',
        'flags.a5e.effects.rollMode.abilityCheck.wis',
        'system.abilities.cha.check.bonus',
        'system.abilities.cha.check.expertiseDice',
        'system.abilities.cha.value',
        'system.abilities.con.check.bonus',
        'system.abilities.con.check.expertiseDice',
        'system.abilities.con.value',
        'system.abilities.dex.check.bonus',
        'system.abilities.dex.check.expertiseDice',
        'system.abilities.dex.value',
        'system.abilities.int.check.bonus',
        'system.abilities.int.check.expertiseDice',
        'system.abilities.int.value',
        'system.abilities.str.check.bonus',
        'system.abilities.str.check.expertiseDice',
        'system.abilities.str.value',
        'system.abilities.wis.check.bonus',
        'system.abilities.wis.check.expertiseDice',
        'system.abilities.wis.value'
      ]
    },
    ac: {
      label: 'A5E.effects.groups.ac',
      items: [
        'system.attributes.ac.baseFormula',
        'system.attributes.ac.changes.bonuses.value',
        'system.attributes.ac.value'
      ]
    },
    attackRollModes: {
      label: 'A5E.effects.groups.attackRollModes',
      items: [
        'flags.a5e.effects.rollMode.attack.all',
        'flags.a5e.effects.rollMode.attack.meleeSpellAttack',
        'flags.a5e.effects.rollMode.attack.meleeWeaponAttack',
        'flags.a5e.effects.rollMode.attack.rangedSpellAttack',
        'flags.a5e.effects.rollMode.attack.rangedWeaponAttack'
      ]
    },
    attunement: {
      label: 'A5E.effects.groups.attunement',
      items: [
        'system.attributes.attunement.current',
        'system.attributes.attunement.max'
      ]
    },
    bonuses: {
      label: 'A5E.effects.groups.bonuses',
      items: [
        'flags.a5e.effects.bonuses.abilities',
        'flags.a5e.effects.bonuses.attacks',
        'flags.a5e.effects.bonuses.damage',
        'flags.a5e.effects.bonuses.healing',
        'flags.a5e.effects.bonuses.skills',
        'system.bonuses.abilities.check',
        'system.bonuses.abilities.save',
        'system.bonuses.abilities.skill',
        'system.bonuses.maneuverDC',
        'system.bonuses.spellDC'
      ]
    },
    conditions: {
      label: 'A5E.effects.groups.conditions',
      items: [
        'flags.a5e.effects.statusConditions',
        'system.attributes.fatigue',
        'system.attributes.strife'
      ]
    },
    currency: {
      label: 'A5E.effects.groups.currency',
      items: [
        'system.currency.cp',
        'system.currency.ep',
        'system.currency.gp',
        'system.currency.pp',
        'system.currency.sp'
      ]
    },
    creatureTraits: {
      label: 'A5E.effects.groups.creatureTraits',
      items: [
        'system.traits.size',
        'system.details.creatureTypes',
        'system.details.isSwarm'
      ]
    },
    deathSaves: {
      label: 'A5E.effects.groups.deathSaves',
      items: [
        'flags.a5e.deathSaveThreshold',
        'flags.a5e.effects.rollMode.deathSave',
        'system.attributes.death.failure',
        'system.attributes.death.success'
      ]
    },
    exertion: {
      label: 'A5E.effects.groups.exertion',
      items: [
        'system.attributes.exertion.current',
        'system.attributes.exertion.max',
        'system.attributes.exertion.recoverOnRest'
      ]
    },
    hitDice: {
      label: 'A5E.effects.groups.hitDice',
      items: [
        'system.attributes.hitDice.d20.current',
        'system.attributes.hitDice.d20.total',
        'system.attributes.hitDice.d12.current',
        'system.attributes.hitDice.d12.total',
        'system.attributes.hitDice.d10.current',
        'system.attributes.hitDice.d10.total',
        'system.attributes.hitDice.d6.current',
        'system.attributes.hitDice.d6.total',
        'system.attributes.hitDice.d8.current',
        'system.attributes.hitDice.d8.total',
        'system.attributes.hitDice.d4.current',
        'system.attributes.hitDice.d4.total'
      ]
    },
    hitPoints: {
      label: 'A5E.effects.groups.hitPoints',
      items: [
        'system.attributes.hp.baseMax',
        'system.attributes.hp.bonus',
        'system.attributes.hp.value',
        'system.attributes.hp.max',
        'system.attributes.hp.temp'
      ]
    },
    initiative: {
      label: 'A5E.effects.groups.initiative',
      items: [
        'flags.a5e.effects.rollMode.initiative',
        'flags.a5e.effects.bonuses.initiative',
        'system.attributes.initiative.ability',
        'system.attributes.initiative.expertiseDice'
      ]
    },
    movement: {
      label: 'A5E.effects.groups.movement',
      items: [
        'flags.a5e.effects.movement.allDistances',
        'flags.a5e.effects.movement.allUnits',
        'system.attributes.movement.burrow.distance',
        'system.attributes.movement.burrow.unit',
        'system.attributes.movement.climb.distance',
        'system.attributes.movement.climb.unit',
        'system.attributes.movement.fly.distance',
        'system.attributes.movement.fly.unit',
        'system.attributes.movement.swim.distance',
        'system.attributes.movement.swim.unit',
        'system.attributes.movement.traits.hover',
        'system.attributes.movement.walk.distance',
        'system.attributes.movement.walk.unit'
      ]
    },
    proficiencies: {
      label: 'A5E.effects.groups.proficiencies',
      items: [
        'system.proficiencies.armor',
        'system.proficiencies.languages',
        'system.proficiencies.tools',
        'system.proficiencies.weapons'
      ]
    },
    resistancesVulnerabilitiesImmunities: {
      label: 'A5E.effects.groups.resistancesVulnerabilitiesImmunities',
      items: [
        'flags.a5e.effects.conditionImmunities.all',
        'flags.a5e.effects.damageImmunities.all',
        'flags.a5e.effects.damageResistances.all',
        'flags.a5e.effects.damageVulnerabilities.all',
        'system.traits.conditionImmunities',
        'system.traits.damageImmunities',
        'system.traits.damageResistances',
        'system.traits.damageVulnerabilities'
      ]
    },
    resources: {
      label: 'A5E.effects.groups.resources',
      items: [
        'system.resources.primary.hideMax',
        'system.resources.primary.label',
        'system.resources.primary.max',
        'system.resources.primary.per',
        'system.resources.primary.recharge.formula',
        'system.resources.primary.recharge.threshold',
        'system.resources.primary.value',
        'system.resources.quaternary.hideMax',
        'system.resources.quaternary.label',
        'system.resources.quaternary.max',
        'system.resources.quaternary.per',
        'system.resources.quaternary.recharge.formula',
        'system.resources.quaternary.recharge.threshold',
        'system.resources.quaternary.value',
        'system.resources.secondary.hideMax',
        'system.resources.secondary.label',
        'system.resources.secondary.max',
        'system.resources.secondary.per',
        'system.resources.secondary.recharge.formula',
        'system.resources.secondary.recharge.threshold',
        'system.resources.secondary.value',
        'system.resources.tertiary.hideMax',
        'system.resources.tertiary.label',
        'system.resources.tertiary.max',
        'system.resources.tertiary.per',
        'system.resources.tertiary.recharge.formula',
        'system.resources.tertiary.recharge.threshold',
        'system.resources.tertiary.value'
      ]
    },
    savingThrows: {
      label: 'A5E.effects.groups.savingThrows',
      items: [
        'flags.a5e.effects.rollMode.abilitySave.all',
        'flags.a5e.effects.rollMode.abilitySave.cha',
        'flags.a5e.effects.rollMode.abilitySave.con',
        'flags.a5e.effects.rollMode.abilitySave.dex',
        'flags.a5e.effects.rollMode.abilitySave.int',
        'flags.a5e.effects.rollMode.abilitySave.str',
        'flags.a5e.effects.rollMode.abilitySave.wis',
        'flags.a5e.effects.rollMode.concentration',
        'system.abilities.cha.save.bonus',
        'system.abilities.cha.save.expertiseDice',
        'system.abilities.cha.save.proficient',
        'system.abilities.con.save.bonus',
        'system.abilities.con.save.concentrationBonus',
        'system.abilities.con.save.expertiseDice',
        'system.abilities.con.save.proficient',
        'system.abilities.dex.save.bonus',
        'system.abilities.dex.save.expertiseDice',
        'system.abilities.dex.save.proficient',
        'system.abilities.int.save.bonus',
        'system.abilities.int.save.expertiseDice',
        'system.abilities.int.save.proficient',
        'system.abilities.str.save.bonus',
        'system.abilities.str.save.expertiseDice',
        'system.abilities.str.save.proficient',
        'system.abilities.wis.save.bonus',
        'system.abilities.wis.save.expertiseDice',
        'system.abilities.wis.save.proficient'
      ]
    },
    senses: {
      label: 'A5E.effects.groups.senses',
      items: [
        'flags.a5e.effects.senses.allDistances',
        'flags.a5e.effects.senses.allUnits',
        'system.attributes.senses.blindsight.distance',
        'system.attributes.senses.blindsight.unit',
        'system.attributes.senses.blindsight.otherwiseBlind',
        'system.attributes.senses.darkvision.distance',
        'system.attributes.senses.darkvision.unit',
        'system.attributes.senses.tremorsense.distance',
        'system.attributes.senses.tremorsense.unit',
        'system.attributes.senses.truesight.distance',
        'system.attributes.senses.truesight.unit'
      ]
    },
    skills: {
      label: 'A5E.effects.groups.skills',
      items: [
        'flags.a5e.effects.rollMode.skillCheck.all',
        'flags.a5e.effects.rollMode.skillCheck.acr',
        'flags.a5e.effects.rollMode.skillCheck.ani',
        'flags.a5e.effects.rollMode.skillCheck.arc',
        'flags.a5e.effects.rollMode.skillCheck.ath',
        'flags.a5e.effects.rollMode.skillCheck.cul',
        'flags.a5e.effects.rollMode.skillCheck.dec',
        'flags.a5e.effects.rollMode.skillCheck.eng',
        'flags.a5e.effects.rollMode.skillCheck.his',
        'flags.a5e.effects.rollMode.skillCheck.ins',
        'flags.a5e.effects.rollMode.skillCheck.inv',
        'flags.a5e.effects.rollMode.skillCheck.itm',
        'flags.a5e.effects.rollMode.skillCheck.med',
        'flags.a5e.effects.rollMode.skillCheck.nat',
        'flags.a5e.effects.rollMode.skillCheck.per',
        'flags.a5e.effects.rollMode.skillCheck.prc',
        'flags.a5e.effects.rollMode.skillCheck.prf',
        'flags.a5e.effects.rollMode.skillCheck.rel',
        'flags.a5e.effects.rollMode.skillCheck.slt',
        'flags.a5e.effects.rollMode.skillCheck.ste',
        'flags.a5e.effects.rollMode.skillCheck.sur',
        'system.skills.acr.ability',
        'system.skills.acr.bonuses.check',
        'system.skills.acr.bonuses.passive',
        'system.skills.acr.expertiseDice',
        'system.skills.acr.minRoll',
        'system.skills.acr.proficient',
        'system.skills.acr.specialties',
        'system.skills.acr.value',
        'system.skills.ani.ability',
        'system.skills.ani.bonuses.check',
        'system.skills.ani.bonuses.passive',
        'system.skills.ani.expertiseDice',
        'system.skills.ani.minRoll',
        'system.skills.ani.proficient',
        'system.skills.ani.specialties',
        'system.skills.ani.value',
        'system.skills.arc.ability',
        'system.skills.arc.bonuses.check',
        'system.skills.arc.bonuses.passive',
        'system.skills.arc.expertiseDice',
        'system.skills.arc.minRoll',
        'system.skills.arc.proficient',
        'system.skills.arc.specialties',
        'system.skills.arc.value',
        'system.skills.ath.ability',
        'system.skills.ath.bonuses.check',
        'system.skills.ath.bonuses.passive',
        'system.skills.ath.expertiseDice',
        'system.skills.ath.minRoll',
        'system.skills.ath.proficient',
        'system.skills.ath.specialties',
        'system.skills.ath.value',
        'system.skills.cul.ability',
        'system.skills.cul.bonuses.check',
        'system.skills.cul.bonuses.passive',
        'system.skills.cul.expertiseDice',
        'system.skills.cul.minRoll',
        'system.skills.cul.proficient',
        'system.skills.cul.specialties',
        'system.skills.cul.value',
        'system.skills.dec.ability',
        'system.skills.dec.bonuses.check',
        'system.skills.dec.bonuses.passive',
        'system.skills.dec.expertiseDice',
        'system.skills.dec.minRoll',
        'system.skills.dec.proficient',
        'system.skills.dec.specialties',
        'system.skills.dec.value',
        'system.skills.eng.ability',
        'system.skills.eng.bonuses.check',
        'system.skills.eng.bonuses.passive',
        'system.skills.eng.expertiseDice',
        'system.skills.eng.minRoll',
        'system.skills.eng.proficient',
        'system.skills.eng.specialties',
        'system.skills.eng.value',
        'system.skills.his.ability',
        'system.skills.his.bonuses.check',
        'system.skills.his.bonuses.passive',
        'system.skills.his.expertiseDice',
        'system.skills.his.minRoll',
        'system.skills.his.proficient',
        'system.skills.his.specialties',
        'system.skills.his.value',
        'system.skills.ins.ability',
        'system.skills.ins.bonuses.check',
        'system.skills.ins.bonuses.passive',
        'system.skills.ins.expertiseDice',
        'system.skills.ins.minRoll',
        'system.skills.ins.proficient',
        'system.skills.ins.specialties',
        'system.skills.ins.value',
        'system.skills.itm.ability',
        'system.skills.itm.bonuses.check',
        'system.skills.itm.bonuses.passive',
        'system.skills.itm.expertiseDice',
        'system.skills.itm.minRoll',
        'system.skills.itm.proficient',
        'system.skills.itm.specialties',
        'system.skills.itm.value',
        'system.skills.inv.ability',
        'system.skills.inv.bonuses.check',
        'system.skills.inv.bonuses.passive',
        'system.skills.inv.expertiseDice',
        'system.skills.inv.minRoll',
        'system.skills.inv.proficient',
        'system.skills.inv.specialties',
        'system.skills.inv.value',
        'system.skills.med.ability',
        'system.skills.med.bonuses.check',
        'system.skills.med.bonuses.passive',
        'system.skills.med.expertiseDice',
        'system.skills.med.minRoll',
        'system.skills.med.proficient',
        'system.skills.med.specialties',
        'system.skills.med.value',
        'system.skills.nat.ability',
        'system.skills.nat.bonuses.check',
        'system.skills.nat.bonuses.passive',
        'system.skills.nat.expertiseDice',
        'system.skills.nat.minRoll',
        'system.skills.nat.proficient',
        'system.skills.nat.specialties',
        'system.skills.nat.value',
        'system.skills.prc.ability',
        'system.skills.prc.bonuses.check',
        'system.skills.prc.bonuses.passive',
        'system.skills.prc.expertiseDice',
        'system.skills.prc.minRoll',
        'system.skills.prc.proficient',
        'system.skills.prc.specialties',
        'system.skills.prc.value',
        'system.skills.prf.ability',
        'system.skills.prf.bonuses.check',
        'system.skills.prf.bonuses.passive',
        'system.skills.prf.expertiseDice',
        'system.skills.prf.minRoll',
        'system.skills.prf.proficient',
        'system.skills.prf.specialties',
        'system.skills.prf.value',
        'system.skills.per.ability',
        'system.skills.per.bonuses.check',
        'system.skills.per.bonuses.passive',
        'system.skills.per.expertiseDice',
        'system.skills.per.minRoll',
        'system.skills.per.proficient',
        'system.skills.per.specialties',
        'system.skills.per.value',
        'system.skills.rel.ability',
        'system.skills.rel.bonuses.check',
        'system.skills.rel.bonuses.passive',
        'system.skills.rel.expertiseDice',
        'system.skills.rel.minRoll',
        'system.skills.rel.proficient',
        'system.skills.rel.specialties',
        'system.skills.rel.value',
        'system.skills.slt.ability',
        'system.skills.slt.bonuses.check',
        'system.skills.slt.bonuses.passive',
        'system.skills.slt.expertiseDice',
        'system.skills.slt.minRoll',
        'system.skills.slt.proficient',
        'system.skills.slt.specialties',
        'system.skills.slt.value',
        'system.skills.ste.ability',
        'system.skills.ste.bonuses.check',
        'system.skills.ste.bonuses.passive',
        'system.skills.ste.expertiseDice',
        'system.skills.ste.minRoll',
        'system.skills.ste.proficient',
        'system.skills.ste.specialties',
        'system.skills.ste.value',
        'system.skills.sur.ability',
        'system.skills.sur.bonuses.check',
        'system.skills.sur.bonuses.passive',
        'system.skills.sur.expertiseDice',
        'system.skills.sur.minRoll',
        'system.skills.sur.proficient',
        'system.skills.sur.specialties',
        'system.skills.sur.value'
      ]
    },
    spellResources: {
      label: 'A5E.effects.groups.spellResources',
      items: [
        'system.spellResources.points.current',
        'system.spellResources.points.max',
        'system.spellResources.slots.1.current',
        'system.spellResources.slots.1.max',
        'system.spellResources.slots.2.current',
        'system.spellResources.slots.2.max',
        'system.spellResources.slots.3.current',
        'system.spellResources.slots.3.max',
        'system.spellResources.slots.4.current',
        'system.spellResources.slots.4.max',
        'system.spellResources.slots.5.current',
        'system.spellResources.slots.5.max',
        'system.spellResources.slots.6.current',
        'system.spellResources.slots.6.max',
        'system.spellResources.slots.7.current',
        'system.spellResources.slots.7.max',
        'system.spellResources.slots.8.current',
        'system.spellResources.slots.8.max',
        'system.spellResources.slots.9.current',
        'system.spellResources.slots.9.max'
      ]
    },
    token: {
      label: 'A5E.effects.groups.token',
      items: [
        '@token.width',
        '@token.height'
      ]
    },
    tokenLight: {
      label: 'A5E.effects.groups.tokenLight',
      items: [
        '@token.light.alpha',
        '@token.light.angle',
        '@token.light.animation.intensity',
        '@token.light.animation.reverse',
        '@token.light.animation.speed',
        '@token.light.animation.type',
        '@token.light.attenuation',
        '@token.light.bright',
        '@token.light.color',
        '@token.light.coloration',
        '@token.light.contrast',
        '@token.light.darkness.min',
        '@token.light.darkness.max',
        '@token.light.dim',
        '@token.light.luminosity',
	'@token.light.negative',
        '@token.light.saturation',
        '@token.light.shadows'
      ]
    },
    tokenTexture: {
      label: 'A5E.effects.groups.tokenTexture',
      items: [
        '@token.texture.src',
        '@token.scaleX',
        '@token.scaleY'
      ]
    },
    other: {
      label: 'A5E.effects.groups.other',
      items: []
    }
  };

  return { effectKeyGroups };
}
