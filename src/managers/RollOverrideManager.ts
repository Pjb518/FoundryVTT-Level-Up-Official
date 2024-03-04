type OverrideType = 'rollMode' | 'expertiseDice';

type Change = {
  key: string;
  value: number;
  mode: number;
  name: string;
  type: OverrideType;
};

export interface RollOverride {
  overrideType: OverrideType;
  mode?: number;
  source: string;
  value: number;
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
    // Register expertise die from actor data
    Object.entries(this.actor.system.abilities).forEach(([ablKey, ability]: [string, any]) => {
      ['check', 'save'].forEach((type) => {
        if (ability[type]?.expertiseDice) {
          const die = ability[type]?.expertiseDice;
          this.overrides.get(`system.abilities.${ablKey}.${type}`)?.push(
            {
              value: die,
              overrideType: 'expertiseDice',
              source: CONFIG.A5E.abilities[ablKey],
              mode: CONFIG.A5E.ACTIVE_EFFECT_MODES.OVERRIDE
            }
          );
        }
      });
    });

    Object.entries(this.actor.system.skills).forEach(([skillKey, skill]: [string, any]) => {
      if (skill.expertiseDice) {
        const die = skill.expertiseDice;
        this.overrides.get(`system.skills.${skillKey}`)?.push(
          {
            value: die,
            overrideType: 'expertiseDice',
            source: CONFIG.A5E.skills[skillKey],
            mode: CONFIG.A5E.ACTIVE_EFFECT_MODES.OVERRIDE
          }
        );
      }
    });

    // Register all overrides from items
    this.actor.items.forEach((item: typeof Item) => {
      if (item.type !== 'object' && item.system?.objectType !== 'armor') return;

      // Add disadvantage to stealth checks for armor
      if (
        item.system.equippedState === CONFIG.A5E.ARMOR_MODES.OVERRIDE
        && item.system.ac.grantsDisadvantage
      ) {
        this.overrides.get('system.skills.ste')?.push({ value: -1, overrideType: 'rollMode', source: item.name });
      }
    });

    // Register all overrides from effects
    const changes = this.actor.effects.reduce((acc: Change[], effect: typeof ActiveEffect) => {
      if (effect.disabled) return acc;
      if (effect.changes.length === 0) return acc;

      const data: any[] = [];
      effect.changes.forEach((change) => {
        if (!change.key.startsWith('flags.a5e.effects.rollMode') && !change.key.startsWith('flags.a5e.effects.expertiseDice')) return;
        let key: string = change.key.replace('flags.a5e.effects.', '');
        const type = key.split('.').shift();
        if (type === 'rollMode') key = key.replace('rollMode.', '');
        else key = key.replace('expertiseDice.', '');

        data.push({
          key,
          value: parseInt(change.value, 10) || 0,
          mode: change.mode,
          name: effect.name,
          type
        });
      });

      if (data.length) acc.push(...data);
      return acc;
    }, []);

    changes.forEach((change: Change) => {
      const {
        key, value, name: source, type: overrideType, mode
      } = change;

      if (['concentration', 'deathSave', 'initiative'].includes(key)) {
        this.overrides
          .get(key)?.push({
            value, overrideType, source, mode
          });
        return;
      }

      if (key === 'abilityCheck.all') {
        this.overrides.get('abilityCheck.all')?.push({
          value, overrideType, source, mode
        });
        return;
      }

      if (key === 'abilitySave.all') {
        this.overrides.get('abilitySave.all')?.push({
          value, overrideType, source, mode
        });
        return;
      }

      if (key === 'skillCheck.all') {
        this.overrides.get('skillCheck.all')?.push({
          value, overrideType, source, mode
        });
        return;
      }

      if (key === 'attack.all') {
        this.overrides.get('attack.all')?.push({
          value, overrideType, source, mode
        });
        return;
      }

      if (key === 'all' && overrideType === 'expertiseDice') {
        this.overrides.get('abilityCheck.all')?.push({
          value, overrideType, source, mode
        });

        this.overrides.get('abilitySave.all')?.push({
          value, overrideType, source, mode
        });

        // We don't need to add to skills because it's already handled by the ability

        this.overrides.get('attack.all')?.push({
          value, overrideType, source, mode
        });
        return;
      }

      const [propertyType, propertyKey] = key.split('.');
      if (['abilityCheck', 'abilitySave'].includes(propertyType)) {
        const type = propertyType === 'abilityCheck' ? 'check' : 'save';
        this.overrides.get(`system.abilities.${propertyKey}.${type}`)?.push({
          value, overrideType, source, mode
        });
        return;
      }

      if (propertyType === 'skillCheck') {
        this.overrides.get(`system.skills.${propertyKey}`)?.push({
          value, overrideType, source, mode
        });
        return;
      }

      if (propertyType === 'attack') {
        this.overrides.get(`attackTypes.${propertyKey}`)?.push({
          value, overrideType, source, mode
        });
      }
    });

    this.ready = true;
  }

  #prepareOverrides(
    key: string,
    overrideType: OverrideType = 'rollMode',
    options: { ability?: string, skill?: string } = {}
  ) {
    const overrides = this.overrides.get(key)?.filter((o) => o.overrideType === overrideType) ?? [];

    // Add handling for all ability overrides
    if (key.includes('abilities')) {
      this.overrides.get('abilityCheck.all')?.forEach((o) => {
        if (o.overrideType !== overrideType) return;
        overrides.push(o);
      });
    }

    // Add handling for all skill overrides as well as the ability overrides
    if (key.includes('skills')) {
      this.overrides.get('skillCheck.all')?.forEach((o) => {
        if (o.overrideType !== overrideType) return;
        overrides.push(o);
      });

      // Add specific ability override for skills as well as the all override
      const ability = options.ability || this.actor.system.skills[key.split('.').pop() as string]?.ability || '';
      if (ability) {
        this.overrides.get(`system.abilities.${ability}.check`)?.forEach((o) => {
          if (o.overrideType !== overrideType) return;
          overrides.push(o);
        });
      }

      this.overrides.get('abilityCheck.all')?.forEach((o) => {
        if (o.overrideType !== overrideType) return;
        overrides.push(o);
      });
    }

    // Add handling for initiative overrides
    if (key === 'initiative') {
      this.overrides.get('abilityCheck.all')?.forEach((o) => {
        if (o.overrideType !== overrideType) return;
        overrides.push(o);
      });
      this.overrides.get('skillCheck.all')?.forEach((o) => {
        if (o.overrideType !== overrideType) return;
        overrides.push(o);
      });

      const ability = options.ability || '';
      if (ability) {
        this.overrides.get(`system.abilities.${ability}.check`)?.forEach((o) => {
          if (o.overrideType !== overrideType) return;
          overrides.push(o);
        });
      }

      const skill = options.skill || '';
      if (skill) {
        this.overrides.get(`system.skills.${skill}`)?.forEach((o) => {
          if (o.overrideType !== overrideType) return;
          overrides.push(o);
        });
      }
    }

    // Add handling for all attack overrides
    if (key.includes('attack')) {
      this.overrides.get('attack.all')?.forEach((o) => {
        if (o.overrideType !== overrideType) return;
        overrides.push(o);
      });

      // Add handling for flanking
      const flankSetting = game.settings.get('a5e-flanking', 'flankingDND5EMode') ?? false;
      const isFlanking = !!this.actor.getFlag('a5e', 'flanking');
      if (flankSetting && isFlanking) {
        overrides.push({
          overrideType: 'rollMode',
          source: 'Flanking',
          value: CONFIG.A5E.ROLL_MODE.ADVANTAGE
        });
      }
    }

    return overrides;
  }

  // *********************************************************************************************
  //  Roll Override Methods
  // *********************************************************************************************
  getRollOverride(
    key: string,
    baseRollMode: number = 0,
    options: { ability?: string, skill?: string } = {}
  ): number {
    const overrides = this.#prepareOverrides(key, 'rollMode', options);
    if (!overrides?.length) return baseRollMode;

    const hasAdvantage = overrides.some((o) => o.value === CONFIG.A5E.ROLL_MODE.ADVANTAGE);
    const hasDisadvantage = overrides.some((o) => o.value === CONFIG.A5E.ROLL_MODE.DISADVANTAGE);

    if (hasAdvantage && hasDisadvantage) return CONFIG.A5E.ROLL_MODE.NORMAL;
    if (!hasAdvantage && !hasDisadvantage) return baseRollMode;
    if (hasAdvantage) return this.#determineRollMode(baseRollMode, CONFIG.A5E.ROLL_MODE.ADVANTAGE);
    return this.#determineRollMode(baseRollMode, CONFIG.A5E.ROLL_MODE.DISADVANTAGE);
  }

  getRollOverridesSource(
    key: string,
    baseRollMode: number = 0,
    options: { ability?: string, skill?: string } = {}
  ): string {
    const overrides = this.#prepareOverrides(key, 'rollMode', options);
    if (!overrides) return '';

    let base: string;
    if (baseRollMode === CONFIG.A5E.ROLL_MODE.ADVANTAGE) base = 'Advantage';
    else if (baseRollMode === CONFIG.A5E.ROLL_MODE.DISADVANTAGE) base = 'Disadvantage';
    else base = 'Normal';

    const { adv, dis } = overrides.reduce((acc: { adv: string[], dis: string[] }, o) => {
      if (o.value === CONFIG.A5E.ROLL_MODE.ADVANTAGE) acc.adv.push(o.source);
      else if (o.value === CONFIG.A5E.ROLL_MODE.DISADVANTAGE) acc.dis.push(o.source);

      return acc;
    }, { adv: [], dis: [] });

    let advString = '';
    let disString = '';

    if (adv.length) advString = `<p> <strong>Advantage:</strong> ${adv.join(', ')}</p>`;
    if (dis.length) disString = `<p> <strong>Disadvantage:</strong> ${dis.join(', ')}</p>`;

    const result = this.getRollOverride(key, baseRollMode);
    let res: string;
    if (result === CONFIG.A5E.ROLL_MODE.ADVANTAGE) res = 'Advantage';
    else if (result === CONFIG.A5E.ROLL_MODE.DISADVANTAGE) res = 'Disadvantage';
    else res = 'Normal';

    return `<div class='u-text-xs u-text-left'>
      <p> <strong>Base Roll Mode:</strong> ${base}</p>
      ${advString}
      ${disString}
      <p> <strong>Result:</strong> ${res}</p>
    </div>
    `;
  }

  #determineRollMode(original: number, override: number): number {
    // eslint-disable-next-line no-bitwise
    const cancels = (original ^ override) < -1;
    return cancels ? 0 : override;
  }

  // *********************************************************************************************
  //  Expertise Override Methods
  // *********************************************************************************************
  getExpertiseDice(
    key: string,
    baseDie: number = 0,
    options: { ability?: string, skill?: string } = {}
  ): number {
    const overrides = this.#prepareOverrides(key, 'expertiseDice', options);
    if (!overrides?.length) return baseDie;

    // Sort the overrides by mode
    overrides.sort((a, b) => (b.mode ?? 2) - (a.mode ?? 2));

    return 0;
  }
}
