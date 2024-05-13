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

  get averageHP() {
    return Math.floor(this.hitDice.size / 2) + 1;
  }

  get isStartingClass() {
    if (!this.isEmbedded) return false;

    return this.parent.system.classes.startingClass === this.slug;
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

    // Set up class resource manager
    this.resources = new ClassResourceManager(this);

    this.maxHP = this.prepareMaxHitPoints();
    this.hitDice = {
      current: this.totalHitDice - this.system.hp.hitDiceUsed,
      total: this.totalHitDice,
      size: this.system.hp.hitDiceSize
    };

    this.casting = this.prepareCasterData();
  }

  prepareMaxHitPoints() {
    const { levels } = this.system.hp;

    return Object.entries(levels ?? {}).reduce((acc, [level, value]) => {
      if (level > this.classLevels) return acc;
      return acc + value;
    }, 0);
  }

  prepareCasterData() {
    const { casterType } = this.system.spellcasting;
    if (!casterType || casterType === 'none' || !this.classLevels) return null;

    const progressionConfig = CONFIG.A5E.casterProgression[casterType] ?? null;
    if (!progressionConfig) return null;

    const {
      type, config, resource, multiplier, roundUp, multiclassMode
    } = progressionConfig;

    const data = { casterType, resource, progressionType: type };

    // Add spellcasting resource data
    if (type === 'multiplier' && resource === 'slots') {
      const roundFunc = Math.ceil;
      const slots = config[roundFunc(this.classLevels * (multiplier ?? 1))] ?? [];

      data.slots = Object.fromEntries(slots.map((slot, idx) => {
        const skip = Math.round(1 / multiplier) > this.classLevels;
        if (multiplier < 1 && skip && !roundUp) return [idx + 1, 0];

        return [idx + 1, slot];
      }));
    }

    if (type === 'reference') {
      const ref = config[this.classLevels];
      data.multiclassMode = multiclassMode;
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

    data.actorTransfer = {
      level: this.classLevels,
      hitDiceSize: this.system.hp.hitDiceSize,
      hitDiceUsed: this.system.hp.hitDiceUsed
    };

    return data;
  }

  _preCreate(data, options, user) {
    foundry.utils.setProperty(data, 'system.classLevels', 1);
    foundry.utils.setProperty(data, 'system.hp.hitDiceUsed', 0);

    // Update starting hp
    if (!foundry.utils.getProperty(data, 'system.hp.levels.1')) {
      const startingHp = foundry.utils.getProperty(data, 'system.hp.hitDiceSize') ?? 6;
      foundry.utils.setProperty(data, 'system.hp.levels.1', startingHp);
    }

    // Reset hp rolls
    Array.from({ length: 19 }, (_, i) => i + 2).forEach((level) => {
      foundry.utils.setProperty(data, `system.hp.levels.${level}`, 0);
    });

    if (this.parent?.documentName === 'Actor') {
      const actor = this.parent;
      const { classes } = actor;

      if (!Object.keys(classes).length) {
        actor.update({ 'system.classes.startingClass': this.slug });
      }

      const existing = classes[this.slug];
      if (existing) {
        existing.update({ 'system.classLevels': Math.min(existing.system.classLevels + 1, 20) });
        return false;
      }
    }

    this.updateSource(data);

    super._preCreate(data, options, user);
    return true;
  }

  // eslint-disable-next-line consistent-return
  async _preUpdate(changed, options, user) {
    super._preUpdate(changed, options, user);

    const keys = Object.keys(foundry.utils.flattenObject(changed));
    if (keys.includes('system.hp.hitDiceSize') && (this.isStartingClass || !this.parent)) {
      const size = foundry.utils.getProperty(changed, 'system.hp.hitDiceSize');
      await this.updateSource({ 'system.hp.levels.1': size });
    }

    if (keys.includes('system.slug') && this.isStartingClass && this.parent?.documentName === 'Actor') {
      const slug = foundry.utils.getProperty(changed, 'system.slug');
      this.parent.update({ 'system.classes.startingClass': slug });
    }

    // Clamp hitDice used
    if (keys.includes('system.hp.hitDiceUsed')) {
      const used = foundry.utils.getProperty(changed, 'system.hp.hitDiceUsed');
      const max = this.totalHitDice;
      await this.updateSource({ 'system.hp.hitDiceUsed': Math.clamp(used, 0, max) });
    }

    if (this.parent?.documentName === 'Actor' && keys.includes('system.classLevels')) {
      const actor = this.parent;
      const currentLevel = this.system.classLevels;
      const newLevel = foundry.utils.getProperty(changed, 'system.classLevels');
      const result = await actor.grants.createLeveledGrants(currentLevel, newLevel, this);
      if (!result) return false;
    }
  }

  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
  }

  async _onUpdate(data, options, userId) {
    super._onUpdate(data, options, userId);
  }

  async _onDelete(data, options, user) {
    super._onDelete(data, options, user);
  }
}
