export default function registerBonusesConfig(A5E) {
  A5E.bonusTypes = {
    abilities: 'A5E.Ability',
    attacks: 'A5E.Attack',
    damage: 'A5E.Damage',
    healing: 'A5E.Healing',
    initiative: 'A5E.Initiative',
    movement: 'A5E.Movement',
    // proficiency: 'A5E.Proficiency',
    senses: 'A5E.Senses',
    skills: 'A5E.Skill'
  };

  A5E.bonusDialogKeys = {
    abilities: 'abilityBonus',
    attacks: 'attackBonus',
    damage: 'damageBonus',
    healing: 'healingBonus',
    initiative: 'initiativeBonus',
    movement: 'movementBonus',
    // proficiency: 'proficiencyBonus',
    senses: 'sensesBonus',
    skills: 'skillBonus'
  };

  A5E.bonusLabels = {
    abilities: {
      addButton: 'A5E.bonuses.labels.ability.addButton',
      sectionHeader: 'A5E.bonuses.labels.ability.sectionHeader',
      defaultName: 'A5E.bonuses.labels.ability.defaultName',
      dialogName: 'A5E.bonuses.labels.abilities.dialogName'
    },
    attacks: {
      addButton: 'A5E.bonuses.labels.attack.addButton',
      sectionHeader: 'A5E.bonuses.labels.attack.sectionHeader',
      defaultName: 'A5E.bonuses.labels.attack.defaultName',
      dialogName: 'A5E.bonuses.labels.attacks.dialogName'
    },
    damage: {
      addButton: 'A5E.bonuses.labels.damage.addButton',
      sectionHeader: 'A5E.bonuses.labels.damage.sectionHeader',
      defaultName: 'A5E.bonuses.labels.damage.defaultName',
      dialogName: 'A5E.bonuses.labels.damage.dialogName'
    },
    healing: {
      addButton: 'A5E.bonuses.labels.healing.addButton',
      sectionHeader: 'A5E.bonuses.labels.healing.sectionHeader',
      defaultName: 'A5E.bonuses.labels.healing.defaultName',
      dialogName: 'A5E.bonuses.labels.healing.dialogName'
    },
    initiative: {
      addButton: 'A5E.bonuses.labels.initiative.addButton',
      sectionHeader: 'A5E.bonuses.labels.initiative.sectionHeader',
      defaultName: 'A5E.bonuses.labels.initiative.defaultName',
      dialogName: 'A5E.bonuses.labels.initiative.dialogName'
    },
    movement: {
      addButton: 'A5E.bonuses.labels.movement.addButton',
      sectionHeader: 'A5E.bonuses.labels.movement.sectionHeader',
      defaultName: 'A5E.bonuses.labels.movement.defaultName',
      dialogName: 'A5E.bonuses.labels.movement.dialogName'
    },
    senses: {
      addButton: 'A5E.bonuses.labels.senses.addButton',
      sectionHeader: 'A5E.bonuses.labels.senses.sectionHeader',
      defaultName: 'A5E.bonuses.labels.senses.defaultName',
      dialogName: 'A5E.bonuses.labels.senses.dialogName'
    },
    skills: {
      addButton: 'A5E.bonuses.labels.skill.addButton',
      sectionHeader: 'A5E.bonuses.labels.skill.sectionHeader',
      defaultName: 'A5E.bonuses.labels.skill.defaultName',
      dialogName: 'A5E.bonuses.labels.skill.dialogName'
    }
  };
}
