import OriginItemA5e from './origin';

import ClassResourceManager from '../../managers/ClassResourceManager';

export default class ClassItemA5e extends OriginItemA5e {
  get associatedLevels() {
    const { levels } = this.system.hp;
    return Object.entries(levels ?? {}).reduce((acc, [level, value]) => {
      if (!value) return acc;
      acc.push(level);
      return acc;
    }, []);
  }

  get isStartingClass() {
    if (!this.isEmbedded) return false;

    return this.parent.system.classes.startingClass === this.id;
  }

  get classLevels() {
    return this.system.classLevels;
  }

  get subclass() {
    return null;
  }

  get slug() {
    return this.system.slug || this.name.slugify();
  }

  get totalHitDice() {
    return this.classLevels;
  }

  prepareBaseData() {
    super.prepareBaseData();

    // TODO: Class Documents - If no parent class reset classLevels, hitDice, hp

    // Set up class resource manager
    this.resources = new ClassResourceManager(this);

    this.maxHp = this.prepareMaxHitPoints();
    this.hitDice = {
      current: this.totalHitDice - this.system.hp.hitDiceUsed,
      total: this.totalHitDice,
      size: this.system.hp.hitDiceSize
    };

    this.casting = this.prepareCasterData();
  }

  prepareDerivedData() {
  }

  prepareMaxHitPoints() {
    const { levels } = this.system.hp;

    return Object.entries(levels ?? {}).reduce((acc, [level, value]) => {
      if (level > this.classLevels) return acc;
      return acc + value.hp;
    }, 0);
  }

  prepareCasterData() {
    const { casterType } = this.system.spellcasting;
    if (!casterType || casterType === 'none' || !this.classLevels) return null;

    const progressionConfig = CONFIG.A5E.casterProgression[casterType] ?? null;
    if (!progressionConfig) return null;

    const {
      type, config, resource, multiplier, roundUp
    } = progressionConfig;

    const data = { casterType, resource, progressionType: type };

    // Add spellcasting resource data
    if (type === 'multiplier' && resource === 'slots') {
      const roundFunc = roundUp ? Math.ceil : Math.floor;
      const slots = config[roundFunc(this.classLevels * multiplier)];

      data.slots = Object.fromEntries(slots.map((slot, idx) => ([
        idx + 1,
        slot
      ])));
    }

    if (type === 'reference') {
      const ref = config[this.classLevels];
      if (resource === 'slots') {
        data.slots = { [ref.level]: ref.slots };
      } else if (resource === 'points') {
        data.points = ref.points;
        data.maxLevel = ref.level;
      } else if (resource === 'inventions') {
        data.inventions = ref.count;
        data.maxLevel = ref.level;
      } else if (resource === 'artifactCharges') {
        data.charges = ref.charges;
        data.maxLevel = ref.level;
      }
    }

    // Add known data for spells and cantrips
    const knownCantrips = this.system.spellcasting.knownCantrips[this.classLevels] ?? 0;
    const knownSpells = this.system.spellcasting.knownSpells[this.classLevels] ?? 0;

    if (knownCantrips) data.knownCantrips = knownCantrips;
    if (knownSpells) data.knownSpells = knownSpells;

    return data;
  }

  getRollData() {
    const data = { ...super.getRollData() };
    // TODO: Class Documents - Add class specific data here
    return data;
  }

  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
  }

  async _onDelete(data, options, user) {
    super._onDelete(data, options, user);
  }
}
