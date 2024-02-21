type OverrideType = 'rollMode' | 'expertiseDie';

export interface RollOverride {
  value: number;
  overrideType: OverrideType;
}

export default class RollOverrideManager {
  actor: typeof Actor;

  overrides: Map<string, RollOverride[]>;

  ready: boolean;

  constructor(actor: typeof Actor) {
    this.actor = actor;

    // Setup override arrays
    this.overrides = new Map<string, RollOverride[]>();
    this.overrides.set('abilityCheck.all', []);
    this.overrides.set('abilitySave.all', []);
    Object.keys(CONFIG.A5E.abilities).forEach((ability) => {
      this.overrides.set(`system.abilities.${ability}.check`, []);
      this.overrides.set(`system.abilities.${ability}.save`, []);
    });

    this.overrides.set('skillCheck.all', []);
    Object.keys(CONFIG.A5E.skills).forEach((skill) => {
      this.overrides.set(`system.skills.${skill}`, []);
    });

    this.overrides.set('attack.all', []);
    Object.keys(CONFIG.A5E.attackTypes).forEach((attackType) => {
      this.overrides.set(`attackTypes.${attackType}`, []);
    });

    this.overrides.set('concentration', []);
    this.overrides.set('deathSave', []);
    this.overrides.set('initiative', []);

    this.ready = false;
  }

  initialize() {
    const overrideTypes = ['rollMode', 'expertiseDie'] as OverrideType[];

    // Register all overrides from items
    this.actor.items.forEach((item: typeof Item) => {
      if (item.type !== 'object' && item.system?.objectType !== 'armor') return;

      // Add disadvantage to stealth checks for armor
      if (
        item.system.equippedState === CONFIG.A5E.ARMOR_MODES.OVERRIDE
        && item.system.ac.grantsDisadvantage
      ) {
        this.overrides.get('system.skills.ste')?.push({ value: -1, overrideType: 'rollMode' });
      }
    });

    // Register all overrides from effects
    // TODO: Add source data for these effects
    overrideTypes.forEach((overrideType) => {
      const overrideFlags: Record<string, any> = foundry.utils.flattenObject(
        foundry.utils.getProperty(this.actor, `flags.a5e.effects.${overrideType}`) ?? {}
      );

      Object.entries(overrideFlags).forEach(([key, value]) => {
        if (['concentration', 'deathSave', 'initiative'].includes(key)) {
          this.overrides.get(key)?.push({ value, overrideType });
          return;
        }

        if (key === 'abilityCheck.all') {
          this.overrides.get('abilityCheck.all')?.push({ value, overrideType });
          return;
        }

        if (key === 'abilitySave.all') {
          this.overrides.get('abilitySave.all')?.push({ value, overrideType });
          return;
        }

        if (key === 'skillCheck.all') {
          this.overrides.get('skillCheck.all')?.push({ value, overrideType });
          return;
        }

        if (key === 'attack.all') {
          this.overrides.get('attack.all')?.push({ value, overrideType });
        }

        const [propertyType, propertyKey] = key.split('.');
        if (['abilityCheck', 'abilitySave'].includes(propertyType)) {
          const type = propertyType === 'abilityCheck' ? 'check' : 'save';
          this.overrides.get(`system.abilities.${propertyKey}.${type}`)?.push({ value, overrideType });
          return;
        }

        if (propertyType === 'skillCheck') {
          this.overrides.get(`system.skills.${propertyKey}`)?.push({ value, overrideType });
          return;
        }

        if (propertyType === 'attack') {
          this.overrides.get(`attackTypes.${propertyKey}`)?.push({ value, overrideType });
          return;
        }

        console.log(this.overrides);
      });
    });

    // const expertiseDieFlags: Record<string, any> = foundry.utils.getProperty(this.actor, 'flags.a5e.effects.expertiseDie') ?? {};

    this.ready = true;
  }
}
