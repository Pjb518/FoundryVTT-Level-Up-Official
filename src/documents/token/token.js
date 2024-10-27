import TokenPreviewManger from '../../managers/TokenPreviewManager';

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
    // Include all HUD-enabled status effects
    const choices = {};
    for (const status of CONFIG.statusEffects) {
      if (status.hud === false) continue;
      choices[status.id] = {
        _id: status._id,
        id: status.id,
        title: game.i18n.localize(status.name),
        src: status.img,
        isActive: false,
        isOverlay: false
      };
    }

    // Update the status of effects which are active for the token actor
    const activeEffects = this.actor?.effects || [];
    for (const effect of activeEffects) {
      for (const statusId of effect.statuses) {
        const status = choices[statusId];
        if (!status) continue;
        if (status._id) {
          if (status._id !== effect.id) continue;
        } else if (effect.statuses.size !== 1) continue;
        status.isActive = true;
        if (effect.getFlag('core', 'overlay')) status.isOverlay = true;
        break;
      }
    }

    // Flag status CSS class
    for (const status of Object.values(choices)) {
      status.cssClass = [
        status.isActive ? 'active' : null,
        status.isOverlay ? 'overlay' : null
      ].filterJoin(' ');
    }

    return choices;
  }

  _getActiveConditions() {
    return Object.values(this._getStatusEffectChoices()).reduce((arr, e) => {
      if (e.isActive) arr.push(e.id);
      return arr;
    }, []);
  }

  _addStatusEffect({ id, src }, { overlay } = {}) {
    if (['corruption', 'fatigue', 'exhaustion', 'inebriated', 'strife'].includes(id)) {
      return this.actor.toggleStatusEffect(id, { active: true, overlay });
    }

    const activeConditions = this._getActiveConditions();
    if (activeConditions.includes(id)) return this._removeStatusEffect({ id, src }, { overlay });
    return this.actor.toggleStatusEffect(id, { active: true, overlay });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _removeStatusEffect({ id, src }, { overlay } = {}) {
    if (['corruption', 'fatigue', 'exhaustion', 'inebriated', 'strife'].includes(id)) {
      return this.actor.toggleStatusEffect(id, { active: false, overlay });
    }

    return this.actor.toggleStatusEffect(id, { active: false, overlay });
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
    const tempPct = Math.clamp(temp, 0, max) / max;
    const valuePct = Math.clamp(value, 0, max) / max;
    const colorPct = Math.clamp(value, 0, max) / max;

    // Determine colors to use
    const blk = 0x000000;
    const hpColor = PIXI.utils.rgb2hex([(1 - (colorPct / 2)), colorPct, 0]);
    const c = CONFIG.A5E.tokenHPColors;

    // Determine the container size (logic borrowed from core)
    const { w } = this;
    let h = Math.max((canvas.dimensions.size / 12), 8);
    if (this.document.height >= 2) h *= 1.6;
    const bs = Math.clamp(h / 8, 1, 2);
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
    // const effectsCount = this.actor?.effects?.filter((e) => {
    //   const isOverlay = e.getFlag('core', 'overlay') ?? false;
    //   if (isOverlay) return false;

    //   const isActive = e.isSuppressed ?? false;
    //   if (isActive) return false;

    //   const isTemporary = e.isTemporary ?? false;
    //   const isOnUse = e.getFlag('a5e', 'transferType') === 'onUse';
    //   if (!isTemporary && !isOnUse) return false;

    //   return true;
    // })?.length ?? 0;

    // if (!effectsCount || !this.effects.children.length) return;

    const background = this.effects.children[0];
    if (!(background instanceof PIXI.Graphics)) return;
    background.clear();

    // const icons = this.effects.children.slice(1, 1 + effectsCount);
    const icons = this.effects.children.filter((e) => {
      if (e === this.effects.overlay) return false;
      if (e === this.effects.bg) return false;

      return true;
    });

    const tokenSize = Math.max(this.document.height, this.document.width);
    const gridSize = this?.scene?.grid?.size ?? 100;

    const max = sizeScales.maxIcons(tokenSize) ?? 10;
    let ringCounter = 0;

    icons.forEach((icon, idx) => {
      if (!(icon instanceof PIXI.Sprite)) return;
      if (idx !== 0 && idx % max === 0) ringCounter += 1;

      icon.anchor.set(0.5);

      const iconScale = sizeScales.iconScale(tokenSize) ?? 1.4;
      const gridScale = gridSize / 100;
      const scaledSize = 12 * iconScale * gridScale;

      // Update icon size
      icon.width = scaledSize;
      icon.height = scaledSize;

      // Update icon position
      const ratio = idx / max;
      const tokenTileFactor = this?.document?.width ?? 1;
      const ringOffset = sizeScales.ringOffset(tokenSize) * ringCounter;
      const sizeOffset = (sizeScales.sizeOffset(tokenSize) ?? 1.4) + ringOffset;
      const offset = sizeOffset * tokenTileFactor * gridSize;
      const ringRotation = ringCounter % 2 === 0 ? 0 : sizeScales.ringRotation(tokenSize);
      const rotation = ((0.5 + (1 / max) * Math.PI) * Math.PI);
      const theta = (ratio + ringRotation) * 2 * Math.PI + rotation;
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

    const texture = await loadTexture(src, { fallback: 'icons/svg/hazard.svg' });
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
    this.effects.overlay = icon ?? null;
    return icon;
  }

  // ********************************************************************
  //                         Token Preview Draw
  // ********************************************************************
  async drawPreview() {
    const PreviewManager = new TokenPreviewManger(this);
    return PreviewManager.preview();
  }
}
