type ContextComponent = {
  heading: string;
  options?: any[];
  selectedProperty: string;
  component: string;
};

export default function getContextsMap(type: 'bonus' | 'grant', contextType: string): ContextComponent[] {
  const map: ContextComponent[] = [];

  if (contextType === 'abilities') {
    if (type === 'bonus') {
      map.push(
        {
          heading: 'A5E.contexts.abilities',
          options: Object.entries(CONFIG.A5E.abilities),
          selectedProperty: 'context.abilities',
          component: 'TagGroup'
        }
      );
    } else {
      map.push(
        {
          heading: 'Base Abilities',
          options: Object.entries(CONFIG.A5E.abilities),
          selectedProperty: 'abilities.base',
          component: 'TagGroup'
        },
        {
          heading: 'Ability Choices',
          options: Object.entries(CONFIG.A5E.abilities),
          selectedProperty: 'abilities.options',
          component: 'TagGroup'
        }
      );
    }

    map.push(
      {
        heading: 'Count',
        selectedProperty: 'abilities.total',
        component: 'Number'
      },
      {
        heading: 'A5E.contexts.bonusTypes',
        options: Object.entries(CONFIG.A5E.abilityBonusContexts),
        selectedProperty: 'context.types',
        component: 'TagGroup'
      },
      {
        heading: 'A5E.contexts.requiresProficiency',
        selectedProperty: 'context.requiresProficiency',
        component: 'Checkbox'
      }
    );
  }

  if (contextType === 'damage') {
    map.push(
      {
        heading: 'A5E.contexts.attackType',
        options: Object.entries(CONFIG.A5E.damageBonusContexts),
        selectedProperty: 'context.attackTypes',
        component: 'TagGroup'
      },
      {
        heading: 'A5E.contexts.damageType',
        options: Object.entries(CONFIG.A5E.damageTypes),
        selectedProperty: 'context.damageTypes',
        component: 'TagGroup'
      },
      {
        heading: 'A5E.contexts.spellLevel',
        options: Object.entries(CONFIG.A5E.spellLevels),
        selectedProperty: 'context.spellLevels',
        component: 'TagGroup'
      },
      {
        heading: 'This bonus only applies to critical hits.',
        selectedProperty: 'context.isCritBonus',
        component: 'Checkbox'
      }
    );
  }

  if (contextType === 'healing') {
    map.push(
      {
        heading: 'A5E.contexts.healingType',
        options: Object.entries(CONFIG.A5E.healingBonusContexts),
        selectedProperty: 'context.healingTypes',
        component: 'TagGroup'
      },
      {
        heading: 'A5E.contexts.spellLevel',
        options: Object.entries(CONFIG.A5E.spellLevels),
        selectedProperty: 'context.spellLevels',
        component: 'TagGroup'
      }
    );
  }

  if (contextType === 'skills') {
    if (type === 'bonus') {
      map.push(
        {
          heading: 'A5E.contexts.skills',
          options: Object.entries(CONFIG.A5E.skills),
          selectedProperty: 'context.skills',
          component: 'TagGroup'
        }
      );
    } else {
      map.push(
        {
          heading: 'Base Skills',
          options: Object.entries(CONFIG.A5E.skills),
          selectedProperty: 'skills.base',
          component: 'TagGroup'
        },
        {
          heading: 'Skill Choices',
          options: Object.entries(CONFIG.A5E.skills),
          selectedProperty: 'skills.options',
          component: 'TagGroup'
        }
      );
    }

    map.push(
      {
        heading: 'Count',
        selectedProperty: 'skills.total',
        component: 'Number'
      },
      {
        heading: 'A5E.contexts.requiresProficiency',
        selectedProperty: 'context.requiresProficiency',
        component: 'Checkbox'
      },
      {
        heading: 'A5E.contexts.passiveOnly',
        selectedProperty: 'context.passiveOnly',
        component: 'Checkbox'
      }
    );
  }

  return map;
}
