import sizeScales from './utils/sizeScales';

let circularMask = null;

/**
 * Extend the base Token class to implement additional system-specific logic.
 * @extends {Token}
 */
export default class TokenA5e extends Token {
  /**
   * Get an array of icon paths which represent valid status effect choices
   * @private
   */
  _getStatusEffectChoices() {
    const token = this;
    const doc = token.document;

    // Get statuses which are active for the token actor
    const actor = token.actor || null;
    const statuses = actor ? actor.effects.reduce((obj, effect) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const id of effect.statuses) {
        obj[id] = { id, overlay: !!effect.getFlag('core', 'overlay') };
      }
      return obj;
    }, {}) : {};

    // Prepare the list of effects from the configured defaults and any additional
    // effects present on the Token
    const tokenEffects = foundry.utils.deepClone(doc.effects) || [];
    if (doc.overlayEffect) tokenEffects.push(doc.overlayEffect);
    return CONFIG.statusEffects.concat(tokenEffects).reduce((obj, e) => {
      const src = e.icon ?? e;
      if (src in obj) return obj;
      const status = statuses[e.id] || {};
      const isActive = !!status.id || doc.effects.includes(src);
      const isOverlay = !!status.overlay || doc.overlayEffect === src;
      const label = e.name ?? e.label;
      obj[src] = {
        id: e.id ?? '',
        title: label ? game.i18n.localize(label) : null,
        src,
        isActive,
        isOverlay,
        cssClass: [
          isActive ? 'active' : null,
          isOverlay ? 'overlay' : null
        ].filterJoin(' ')
      };
      return obj;
    }, {});
  }

  _getActiveConditions() {
    return Object.values(this._getStatusEffectChoices()).reduce((arr, e) => {
      if (e.isActive) arr.push(e.id);
      return arr;
    }, []);
  }

  _addStatusEffect({ id, src }, { overlay = false } = {}) {
    const effect = id && this.actor ? CONFIG.statusEffects.find((e) => e.id === id) : src;

    if (['fatigue', 'exhaustion', 'strife'].includes(id)) {
      return this._handleMultiLevelEffectsAdd(effect);
    }

    const activeConditions = this._getActiveConditions();
    if (activeConditions.includes(id)) return this._removeStatusEffect({ id, src }, { overlay });
    return this.toggleEffect(effect, { active: true, overlay });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _removeStatusEffect({ id, src }, { overlay = false } = {}) {
    const effect = id && this.actor ? CONFIG.statusEffects.find((e) => e.id === id) : src;
    if (typeof effect !== 'object') return null;

    if (['fatigue', 'exhaustion', 'strife'].includes(id)) {
      return this._handleMultiLevelEffectsRemove(effect);
    }

    const subConditions = CONFIG.statusEffects.reduce((acc, c) => {
      if (!c?.statuses?.length) return acc;

      c.statuses.forEach((s) => {
        acc[s] ??= [];
        acc[s].push(c.id);
      });
      return acc;
    }, {});

    const activeConditions = this._getActiveConditions();
    const { existing, associated } = this.actor.effects.reduce((arr, e) => {
      if (e.statuses.size === 1 && e.statuses.has(id)) { arr.existing.push(e.id); }

      effect?.statuses?.forEach((s) => {
        if (e.statuses.size === 1 && e.statuses.has(s)) {
          const difference = subConditions[s]?.filter((c) => activeConditions.includes(c));

          if (difference?.length > 1) return;
          arr.associated.push(e.id);
        }
      });

      return arr;
    }, { existing: [], associated: [] });

    if (!existing.length && !associated.length) return null;

    return this.actor.deleteEmbeddedDocuments(
      'ActiveEffect',
      [...existing, ...associated]
    );
  }

  _handleMultiLevelEffectsAdd(effect) {
    if (!effect) return;

    const key = effect.id;
    const currentLevel = this.actor.system.attributes?.[key];
    const maxLevel = CONFIG.A5E.multiLevelConditionsMaxLevel[key] ?? 7;
    if (currentLevel >= maxLevel) return;

    // Find if effect exists
    const existingEffect = this.actor.effects.reduce((arr, e) => {
      if (e.statuses.size === 1 && e.statuses.has(effect.id)) arr.push(e);
      return arr;
    }, [])?.[0];

    const changeKey = key === 'fatigue' && game.settings.get('a5e', 'replaceFatigueAndStrife')
      ? 'exhaustion' : key;
    const changes = Object.entries(CONFIG.A5E.multiLevelConditions[changeKey] ?? {})
      .reduce((arr, [level, c]) => {
        if (level > currentLevel + 1) return arr;
        arr.push(...c);
        return arr;
      }, []);

    if (!existingEffect) {
      const newEffect = foundry.utils.deepClone(effect);
      newEffect.changes = changes;
      this.toggleEffect(newEffect, { active: true, overlay: false });
    } else existingEffect.update({ changes });

    // Update actor to reflect new level
    this.actor.update({
      [`system.attributes.${key}`]: Math.min(currentLevel + 1, maxLevel),
      'flags.a5e.autoApplyFSConditions': false
    });
  }

  _handleMultiLevelEffectsRemove(effect) {
    if (!effect) return;

    const key = effect.id;
    const currentLevel = this.actor.system.attributes?.[key];
    if (currentLevel <= 0) return;

    // Find if effect exists
    const existingEffect = this.actor.effects.reduce((arr, e) => {
      if (e.statuses.size === 1 && e.statuses.has(effect.id)) arr.push(e);
      return arr;
    }, [])?.[0];

    const changeKey = key === 'fatigue' && game.settings.get('a5e', 'replaceFatigueAndStrife')
      ? 'exhaustion' : key;
    const changes = Object.entries(CONFIG.A5E.multiLevelConditions[changeKey] ?? {})
      .reduce((arr, [level, c]) => {
        if (level > currentLevel - 1) return arr;
        arr.push(...c);
        return arr;
      }, []);

    if (existingEffect && currentLevel > 1) {
      existingEffect.update({ changes });
    } else this.toggleEffect(effect, { active: false, overlay: false });

    // Update actor to reflect new level
    this.actor.update({
      [`system.attributes.${key}`]: Math.max(currentLevel - 1, 0),
      'flags.a5e.autoApplyFSConditions': false
    });
  }

  /** @inheritdoc */
  _drawBar(number, bar, data) {
    if (data.attribute === 'attributes.hp') return this._drawHPBar(number, bar, data);
    return super._drawBar(number, bar, data);
  }

  /* -------------------------------------------- */

  /**
   * Specialized drawing function for HP bars.
   *
   * @param {number} number      The Bar number
   * @param {PIXI.Graphics} bar  The Bar container
   * @private
   */
  _drawHPBar(number, bar) {
    // Extract health data
    const { value, max, temp } = this.document.actor.system.attributes.hp;

    // Allocate percentages of the total
    const tempPct = Math.clamped(temp, 0, max) / max;
    const valuePct = Math.clamped(value, 0, max) / max;
    const colorPct = Math.clamped(value, 0, max) / max;

    // Determine colors to use
    const blk = 0x000000;
    const hpColor = PIXI.utils.rgb2hex([(1 - (colorPct / 2)), colorPct, 0]);
    const c = CONFIG.A5E.tokenHPColors;

    // Determine the container size (logic borrowed from core)
    const { w } = this;
    let h = Math.max((canvas.dimensions.size / 12), 8);
    if (this.document.height >= 2) h *= 1.6;
    const bs = Math.clamped(h / 8, 1, 2);
    const bs1 = bs + 1;

    // Overall bar container
    bar.clear();
    bar.beginFill(blk, 0.5).lineStyle(bs, blk, 1.0).drawRoundedRect(0, 0, w, h, 3);

    // Health bar
    bar.beginFill(hpColor, 1.0).lineStyle(bs, blk, 1.0).drawRoundedRect(0, 0, valuePct * w, h, 2);

    // Temporary hit points
    if (temp > 0) {
      // eslint-disable-next-line max-len
      bar.beginFill(c.temp, 1.0).lineStyle(0).drawRoundedRect(bs1, bs1, (tempPct * w) - (2 * bs1), h - (2 * bs1), 1);
    }

    // Set position
    const posY = (number === 0) ? (this.h - h) : 0;
    bar.position.set(0, posY);
  }

  // ********************************************************************
  //                            Radial Effects
  // ********************************************************************
  _refreshEffects() {
    super._refreshEffects();
    if (!(game.settings.get('a5e', 'enableRadialEffects'))) return;

    // Update effect sizes
    const effectsCount = this.actor?.effects?.filter((e) => {
      const isOverlay = e.getFlag('core', 'overlay') ?? false;
      if (isOverlay) return false;

      const isActive = e.isSuppressed ?? false;
      if (isActive) return false;

      const isTemporary = e.isTemporary ?? false;
      const isOnUse = e.getFlag('a5e', 'transferType') === 'onUse';
      if (!isTemporary && !isOnUse) return false;

      return true;
    })?.length ?? 0;

    if (!effectsCount || !this.effects.children.length) return;

    const background = this.effects.children[0];
    if (!(background instanceof PIXI.Graphics)) return;
    background.clear();

    const icons = this.effects.children.slice(1, 1 + effectsCount);
    const tokenSize = this?.actor?.system?.traits?.size ?? 'med';
    const gridSize = this?.scene?.grid?.size ?? 100;

    let max = 20;
    if (tokenSize === 'tiny') max = 10;
    else if (tokenSize === 'sm') max = 14;
    else if (tokenSize === 'med') max = 16;

    icons.forEach((icon, idx) => {
      if (!(icon instanceof PIXI.Sprite)) return;
      // if (idx >= max) return;

      icon.anchor.set(0.5);

      const iconScale = sizeScales.iconScale[tokenSize] ?? 1.0;
      const gridScale = gridSize / 100;
      const scaledSize = 12 * iconScale * gridScale;

      // Update icon size
      icon.width = scaledSize;
      icon.height = scaledSize;

      // Update icon position
      const ratio = idx / max;
      const tokenTileFactor = this?.document?.width ?? 1;
      const sizeOffset = sizeScales.sizeOffset[tokenSize] ?? 1.0;
      const offset = sizeOffset * tokenTileFactor * gridSize;
      const rotation = (0.5 + (1 / max) * Math.PI) * Math.PI;
      const theta = (ratio + 0) * 2 * Math.PI + rotation;
      const x = Math.cos(theta) * offset;
      const y = Math.sin(theta) * offset;

      icon.position.x = x / 2 + (gridSize * tokenTileFactor) / 2;
      icon.position.y = (-1 * y) / 2 + (gridSize * tokenTileFactor) / 2;

      // Update background
      const radius = icon.width / 2;
      background.lineStyle((1 * gridScale) / 2, 0xe9d7a1, 1, 0);
      background.drawCircle(icon.position.x, icon.position.y, radius + 1 * gridScale);
      // background.beginFill(0x292929);
      background.beginFill(0x000000, 0.6);
      background.drawCircle(icon.position.x, icon.position.y, radius + 1 * gridScale);
      background.endFill();
    });
  }

  /**
   * @override
   */
  async _drawEffect(src, tint, isOverlay = false) {
    if (!(game.settings.get('a5e', 'enableRadialEffects'))) return super._drawEffect(src, tint);

    if (!src) return null;

    const texture = await loadTexture(src, { fallback: 'icons/svg/aura.svg' });
    const icon = new PIXI.Sprite(texture);

    if (isOverlay) {
      if (tint) icon.tint = tint;
      return this.effects.addChild(icon);
    }

    if (!circularMask) {
      circularMask = PIXI.RenderTexture.create(110, 110);
      const spriteMask = new PIXI.Graphics().beginFill(0xffffff).drawCircle(55, 55, 55).endFill();
      const blurFilter = new PIXI.filters.BlurFilter(2);
      spriteMask.filters = [blurFilter];
      canvas.app.renderer.render(spriteMask, circularMask);
    }

    const minDimension = Math.min(icon.width, icon.height);

    const mask = new PIXI.Graphics().beginFill(0xffffff).drawCircle(55, 55, 55).endFill();
    mask.width = minDimension;
    mask.height = minDimension;
    mask.x = -icon.width / 2;
    mask.y = -icon.height / 2;

    icon.mask = mask;
    icon.addChild(mask);

    if (tint) icon.tint = tint;

    return this.effects.addChild(icon);
  }

  /**
   * @override
   */
  async _drawOverlay(src, tint) {
    if (!(game.settings.get('a5e', 'enableRadialEffects'))) return super._drawOverlay(src, tint);

    const icon = await this._drawEffect(src, tint, true);
    if (icon) icon.alpha = 0.8;
    return icon;
  }
}
