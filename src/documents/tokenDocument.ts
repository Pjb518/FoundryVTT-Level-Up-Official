/**
 * Extend the base TokenDocument class to implement system-specific HP bar logic.
 * @extends {TokenDocument}
 */
export default class TokenDocumentA5e extends TokenDocument {
  declare automateVision: boolean;

  declare charOnlyVisionAutomation: boolean;

  get scene() {
    return this.parent;
  }

  override prepareBaseData() {
    this.updateTokenSize();
    super.prepareBaseData();
  }

  // TODO: Fix this
  async _onOverrideSize(changes) {
    const width = changes.width || this.width;
    const height = changes.height || this.height;
    this.update({ width, height });
  }

  /* ----------------------------------------
    Detection Mode
  ------------------------------------------- */
  override _prepareDetectionModes() {

    this.automateVision ??=
      game.settings.storage.get("world").getItem("a5e.automateVisionRules") ??
      false;

    this.charOnlyVisionAutomation ??=
      game.settings.storage
        .get("world")
        .getItem("a5e.visionRulesApplyToCharactersOnly") ?? true;

    const { actor, scene } = this;
    if (!this.automateVision || !scene || !actor) {
      super._prepareDetectionModes();
      return;
    }

    if (actor.type === "npc" && this.charOnlyVisionAutomation) {
      super._prepareDetectionModes();
      return;
    }

    const { visionData } = actor;
    const lightPerception = { enabled: true, range: Infinity };
    const basicSight = { enabled: true, range: 0 };
    this.detectionModes = { lightPerception, basicSight };

    const visionMode = visionData.hasDarkvision ? "darkvision" : "basic";
    this.sight.enabled = true;
    this.sight.attenuation = 0.1;
    this.sight.brightness = 0;
    this.sight.contrast = 0;
    this.sight.range = 0;
    this.sight.saturation = 0;
    this.sight.visionMode = visionMode;

    const visionModeDefaults = CONFIG.Canvas.visionModes[visionMode].vision.defaults;
    this.sight.brightness = visionModeDefaults.brightness ?? 0;
    this.sight.saturation = visionModeDefaults.saturation ?? 0;

    if (visionMode === "darkvision") {
      this.sight.range = basicSight.range = visionData.senses.darkvision.distance;
      // TODO: Add support for color darkvision
      this.sight.saturation = 0;
    }

    if (visionData.hasBlindsight) {
      this.detectionModes.blindsight = {
        enabled: true, range: visionData.senses.blindsight.distance ?? 0
      };
    }

    if (visionData.hasTremorsense) {
      this.detectionModes.feelTremor = {
        enabled: true, range: visionData.senses.tremorsense.distance ?? 0
      };
    }

    if (visionData.hasTruesight) {
      this.detectionModes.seeAll = {
        enabled: true, range: visionData.senses.truesight.distance ?? 0
      }
    }

    if (!actor.statuses.has("deafened")) {
      this.detectionModes.hearing = { enabled: true, range: Infinity };
    }

  }

  updateTokenSize() {
    const { actor } = this;
    if (!actor) return;

    const { size } = actor.system.traits;
    const numericalSize = CONFIG.A5E.tokenDimensions[size];
    this.width = numericalSize ?? this.width ?? 1;
    this.height = numericalSize ?? this.height ?? 1;
  }

  /**
   * Overrides base functionality and doesn't update unlinked tokens.
   * @override
   * */
  _onUpdateBaseActor(update = {}, options = {}) {
    // Update synthetic Actor data
    if (!this.isLinked && this.delta) {
      this.delta.updateSyntheticActor();
      // eslint-disable-next-line no-restricted-syntax
      for (const collection of Object.values(this.delta.collections)) {
        collection.initialize({ full: true });
      }
    }

    this._onRelatedUpdate(update, options);
    this._updateCanvas(update);
  }

  // Update canvas if there are changes that affect the canvas
  _updateCanvas(updates) {
    if (!this.scene?.isInFocus && !this.scene?.isView) return;
    if (!this.automateVision || !this.sight.enabled) return;

    const keys = Object.keys(foundry.utils.flattenObject(updates));
    if (keys.some((k) => k.startsWith("system.attributes.senses"))) {
      canvas.perception.update({ initializeVision: true }, true);
      this.reset();
    }
  }

  /** @inheritdoc */
  getBarAttribute(barName, { alternative } = {}) {
    const data = super.getBarAttribute(barName, { alternative });

    if (data && data.attribute === "attributes.hp") {
      data.value += parseInt(
        foundry.utils.getProperty(this.actor.system, "attributes.hp.temp") || 0,
        10,
      );
      data.max += parseInt(
        foundry.utils.getProperty(this.actor.system, "attributes.hp.temp") || 0,
        10,
      );
    }

    return data;
  }
}
