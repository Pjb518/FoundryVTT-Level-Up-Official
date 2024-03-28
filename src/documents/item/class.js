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
    return this.system.hp.hitDiceSize * this.classLevels;
  }

  prepareBaseData() {
    super.prepareBaseData();

    // Set up class resource manager
    this.resources = new ClassResourceManager(this);
  }

  prepareDerivedData() {
    this.maxHp = this.prepareMaxHitPoints();
    this.hitDice = {
      current: this.totalHitDice - this.system.hp.hitDiceUsed,
      total: this.totalHitDice
    };
  }

  prepareMaxHitPoints() {
    const { levels } = this.system.hp;

    return Object.entries(levels ?? {}).reduce((acc, [level, value]) => {
      if (level > this.classLevels) return acc;
      return acc + value.hp;
    }, 0);
  }

  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
  }

  async _onDelete(data, options, user) {
    super._onDelete(data, options, user);
  }
}
