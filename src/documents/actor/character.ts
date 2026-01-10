import type { A5ECharacterData } from "../../dataModels/actor/CharacterDataModel";
import type ClassItemA5e from "../item/class";

import { BaseActorA5e } from "./base.svelte.ts";

import HitDiceManager from "../../managers/HitDiceManager";
import ActionActivationDialog from "../../apps/dialogs/initializers/ActionActivationDialog";

import { getDeterministicBonus } from "../../dice/getDeterministicBonus";

export default class CharacterActorA5E extends BaseActorA5e {
  declare system: A5ECharacterData;

  declare automationAvailable: boolean;

  declare _classes: Record<string, ClassItemA5e> | undefined;

  declare levels: { character: number; classes: Record<string, number> };

  declare classAutomationFlags: Record<string, boolean>;

  get classes() {
    if (this._classes !== undefined) return this._classes;

    this._classes = this.items.reduce((acc, item) => {
      if (item.type !== "class") return acc;

      // @ts-expect-error
      acc[item.slug] = item;
      return acc;
    }, {});

    return this._classes;
  }

  // -------------------------------------------------------------
  // Data Preparation Methods
  // -------------------------------------------------------------
  protected override _initialize(options?: Record<string, unknown>) {
    this._classes = undefined;
    this.classAutomationFlags = {};

    super._initialize(options);
  }

  /**
   * Sets the order of when to prepare data.
   */
  override prepareData() {
    super.prepareData();
  }

  /**
   * Prepare base data for the actor.
   */
  override prepareBaseData() {
    super.prepareBaseData();

    // Setup automation flags
    const automationAvailable = Object.keys(this.classes ?? {}).length > 0;
    this.automationAvailable = automationAvailable;

    this.classAutomationFlags = {
      classes:
        this.getFlag("a5e", "automateClasses") ?? automationAvailable ?? false,
      hitDice:
        this.getFlag("a5e", "automateHitDice") ?? automationAvailable ?? false,
      hitPoints:
        this.getFlag("a5e", "automateHitPoints") ??
        automationAvailable ??
        false,
      spellResources:
        this.getFlag("a5e", "automateSpellResources") ??
        automationAvailable ??
        false,
    };

    this.prepareLevelData();

    // Calculate the proficiency bonus for the character with a minimum value of 2.
    // @ts-expect-error
    this.system.attributes.prof = Math.max(
      2,
      Math.floor((this.levels.character + 7) / 4),
    );
  }

  /**
   * Prepares derived data for the actor.
   */
  override prepareDerivedData() {
    this.HitDiceManager = new HitDiceManager(
      this,
      this.classAutomationFlags.hitDice,
    );

    super.prepareDerivedData();

    const actorData = this.system;

    actorData.attributes.attunement.current = this.items.reduce((acc, curr) => {
      // @ts-expect-error
      const { requiresAttunement, attuned } = curr.system;
      return requiresAttunement && attuned ? acc + 1 : acc;
    }, 0);

    // Update Hit Dice based on manager
    this.system.attributes.hitDice = foundry.utils.mergeObject(
      this.system.attributes.hitDice,
      this.HitDiceManager.bySize,
    );

    foundry.utils.setProperty(
      actorData,
      "attributes.exertion.max",
      this.prepareMaxExertion(),
    );
    foundry.utils.setProperty(
      actorData,
      "attributes.favorPoints.max",
      // @ts-expect-error
      this.system.abilities.cha.mod,
    );

    this.prepareHitPoints();
    this.prepareSpellResources();
    this.prepareResources();
  }

  prepareMaxExertion() {
    const { max: baseMax } = this.system.attributes.exertion;
    if (!this.automationAvailable) return baseMax;

    let max = 0;

    // Get best pool type from actor grants
    // @ts-expect-error
    const pools = this.grants
      ?.byType("exertion")
      .reduce((acc, { exertionData }) => {
        if (!exertionData) return acc;
        if (exertionData.exertionType === "pool")
          acc.push(exertionData.poolType);
        return acc;
      }, [] as string[]);

    if (pools.length === 0) max = baseMax;
    // @ts-expect-error
    else if (pools.includes("doubleProf"))
      max = this.system.attributes.prof * 2;
    // @ts-expect-error
    else if (pools.includes("prof")) max = this.system.attributes.prof;
    else max = baseMax;

    // Add bonuses
    const bonuses =
      getDeterministicBonus(
        this.BonusesManager?.getExertionBonusFormula(),
        this.getRollData(),
      ) ?? 0;

    return max + bonuses;
  }

  prepareHitPoints() {
    if (!this.classAutomationFlags.hitPoints) {
      const { baseMax: baseHP, bonus: bonusHP } = this.system.attributes.hp;
      // @ts-expect-error
      this.system.attributes.hp.max = baseHP + bonusHP;
      this.prepareHitPointBonuses();
      return;
    }

    const { classes } = this;
    const bonusHP = this.system.attributes.hp.bonus ?? 0;
    const maxHP = Object.values(classes ?? {}).reduce(
      (acc, cls) => acc + cls.maxHP,
      0,
    );
    // @ts-expect-error
    const conMod =
      (this.system.abilities.con.check.mod ?? 0) * this.levels.character;

    // @ts-expect-error
    this.system.attributes.hp.max = maxHP + conMod + bonusHP;
    super.prepareHitPointBonuses();
  }

  /**
   * Prepares detailed level data for the actor.
   */
  prepareLevelData() {
    const classes = this.items.filter((item) => item.type === "class");

    if (!this.classAutomationFlags.classes) {
      this.levels = {
        character: this.system.details.level,
        classes: {},
      };

      return;
    }

    const levelData = Object.values(classes ?? {}).reduce(
      (acc, cls) => {
        // @ts-expect-error
        const level = cls.system.classLevels;
        if (!level) return acc;

        // @ts-expect-error
        acc.classes[cls.system.slug || cls.name.slugify({ strict: true })] =
          level;
        acc.character += level;
        return acc;
      },
      { character: 0, classes: {} },
    );

    this.levels = levelData;
  }

  prepareSpellResources() {
    const actorData = this.system;
    const { classes } = this;
    const { spellResources } = actorData;

    // Handle no automation option
    if (!this.classAutomationFlags.spellResources) {
      // @ts-expect-error
      Object.entries(spellResources.slots).forEach(([level, { override }]) => {
        actorData.spellResources.slots[level].max = override || 0;
      });

      actorData.spellResources.points.max = spellResources.points.override || 0;
      // @ts-expect-error
      actorData.spellResources.inventions.max =
        spellResources.inventions.override || 0;
      // @ts-expect-error
      actorData.spellResources.artifactCharges.max =
        spellResources.artifactCharges.override || 0;

      return;
    }

    // Reset max values
    Object.entries(spellResources.slots).forEach(([level]) => {
      actorData.spellResources.slots[level].max = 0;
    });
    actorData.spellResources.points.max = 0;
    // @ts-expect-error
    actorData.spellResources.inventions.max = 0;
    // @ts-expect-error
    actorData.spellResources.artifactCharges.max = 0;

    const grantedResources = {
      slots: [] as ClassItemA5e[],
      additionalSlots: [] as ClassItemA5e[],
      points: [] as ClassItemA5e[],
      inventions: [] as ClassItemA5e[],
      artifactCharges: [] as ClassItemA5e[],
    };

    Object.values(classes).forEach((cls) => {
      const { progressionType, resource } = cls?.casting ?? {};
      if (!progressionType) return;

      if (progressionType === "multiplier") grantedResources.slots.push(cls);
      else if (resource === "artifactCharges")
        grantedResources.artifactCharges.push(cls);
      else if (resource === "inventions") grantedResources.inventions.push(cls);
      else if (resource === "points") grantedResources.points.push(cls);
      else if (resource === "slots") grantedResources.additionalSlots.push(cls);
    });

    // Handle single typed classes
    if (grantedResources.slots.length === 1) {
      const cls = grantedResources.slots[0];
      const { slots: classSlots } = cls.casting!;

      Object.entries(classSlots ?? {}).forEach(([level, slotCount]) => {
        const { max, override } = actorData.spellResources.slots[level];
        actorData.spellResources.slots[level].max =
          override || (max || 0) + (slotCount || 0);
      });
    }

    if (grantedResources.points.length === 1) {
      const cls = grantedResources.points[0];
      const { points } = cls.casting!;
      const { max, override } = actorData.spellResources.points;

      actorData.spellResources.points.max =
        override || (max || 0) + (points || 0);
    }

    if (grantedResources.inventions.length === 1) {
      const cls = grantedResources.inventions[0];
      const { inventions } = cls.casting!;
      // @ts-expect-error
      const { max, override } = actorData.spellResources.inventions;

      // @ts-expect-error
      actorData.spellResources.inventions.max =
        override || (max || 0) + (inventions || 0);
    }

    if (grantedResources.artifactCharges.length === 1) {
      const cls = grantedResources.artifactCharges[0];
      const { charges } = cls.casting!;
      // @ts-expect-error
      const { max, override } = actorData.spellResources.artifactCharges;
      // @ts-expect-error
      actorData.spellResources.artifactCharges.max =
        override || (max || 0) + (charges || 0);
    }

    // Handle multi classed spellcasting for slots
    if (grantedResources.slots.length > 1) {
      const total = grantedResources.slots.reduce((acc, cls) => {
        const { classLevels } = cls;

        const progressionConfig =
          CONFIG.A5E.casterProgression[cls.casting!.casterType];
        if (!progressionConfig) return acc;

        let roundFunc = Math.floor;
        if (progressionConfig.roundUp && progressionConfig.roundUpMulti)
          roundFunc = Math.ceil;
        return acc + roundFunc(classLevels * progressionConfig.multiplier);
      }, 0);

      CONFIG.A5E.SPELL_SLOT_TABLE[total].forEach((slotCount, idx) => {
        const { max, override } = actorData.spellResources.slots[idx + 1];
        actorData.spellResources.slots[idx + 1].max =
          override || (max || 0) + (slotCount || 0);
      });
    }

    // Handle multi classed spellcasting for points
    if (grantedResources.points.length > 1) {
      // TODO: Class Documents - Based on Base reference table

      // Add mode handling
      grantedResources.points.forEach((cls) => {
        // TODO: Class Documents - Update to remove warlockA5E in the future
        const { points, multiclassMode } = cls.casting!;
        if (multiclassMode !== "ADD") return;

        const { max, override } = actorData.spellResources.points;
        actorData.spellResources.points.max =
          override || (max || 0) + (points || 0);
      });
    }

    // Add additional spell slots
    grantedResources.additionalSlots.forEach((cls) => {
      const { slots } = cls.casting!;

      Object.entries(slots ?? {}).forEach(([level, slotCount]) => {
        const { max, override } = actorData.spellResources.slots[level];
        actorData.spellResources.slots[level].max =
          override || (max || 0) + (slotCount || 0);
      });
    });

    // Set max to 0 if not defined
    Object.values(actorData.spellResources.slots).forEach((slot: any) => {
      if (slot.max === undefined) slot.max = 0;
    });

    actorData.spellResources.points.max = spellResources.points.max ?? 0;
    // @ts-expect-error
    actorData.spellResources.inventions.max =
      spellResources.inventions.max ?? 0;
    // @ts-expect-error
    actorData.spellResources.artifactCharges.max =
      spellResources.artifactCharges.max ?? 0;

    // @ts-expect-error
    actorData.spellResources.maxSpellLevel = Object.values(classes).reduce(
      (acc, cls) => {
        const { maxLevel } = cls?.casting ?? {};
        if (!maxLevel) return acc;

        acc[cls.slug] = maxLevel;
        return acc;
      },
      {},
    );
  }

  prepareResources() {
    // @ts-expect-error
    const source = this._source.system.resources as any;

    const genericResources = foundry.utils.deepClone(source);
    delete genericResources.classResources;

    const classResourceData = source.classResources;

    const classResources = this.items.reduce((acc, i) => {
      if (!["class", "archetype"].includes(i.type)) return acc;

      const resources = foundry.utils
        // @ts-expect-error
        .deepClone(i.resources.consumableResources)
        .filter((r) => r.displayOnCore);

      // @ts-expect-error
      const clsLevel = i.resources.level;

      resources.forEach((r) => {
        acc[r.slug] = {
          label: r.name,
          value: classResourceData[r.slug] ?? r.reference[clsLevel] ?? 0,
          max: r.reference[clsLevel] ?? 0,
          per: r.recovery,
          hideMax: false,
          recharge: {
            formula: "1d6",
            threshold: 6,
          },
        };
      });

      return acc;
    }, {});

    const resources = { ...genericResources, ...classResources };

    this.system.resources = resources;
  }

  /**
   * @inheritdoc
   */
  override getRollData(item = null) {
    const data = { ...super.getRollData(item) };

    data.level =
      this.levels?.character ?? data.level ?? this.system.details.level;

    const resources = {};

    data.classes = Object.entries(this.classes ?? {}).reduce(
      (acc, [slug, cls]) => {
        const classData = cls.getRollData()?.actorTransfer ?? {};
        acc[slug] = classData;

        Object.assign(resources, classData.resources);

        return acc;
      },
      {},
    );

    data.classResources = resources;

    return data;
  }

  // -------------------------------------------------------------
  // Resources Reset Handlers
  // -------------------------------------------------------------
  // TODO: Resource Manager - Move to resource manager
  async recoverExertionUsingHitDice() {
    const { current, max } = this.system.attributes.exertion;

    // @ts-expect-error
    const [lowestAvailableHitDie] = Object.entries(
      this.system.attributes.hitDice ?? {},
    ).find(
      // @ts-expect-error
      ([, { current: c, total: t }]) => c > 0 && t > 0,
    );

    if (!lowestAvailableHitDie) {
      ui.notifications.warn(`${this.name} has no hit dice remaining.`);
      return;
    }

    const roll = await new Roll("1d4");

    // TODO: Chat Cards - Make the message prettier
    await roll.toMessage();
    const newExertion = Math.min((current ?? 0) + (roll.total ?? 0), max);
    const newHitDieCount =
      this.system.attributes.hitDice[lowestAvailableHitDie].current - 1;

    await this.update({
      "system.attributes": {
        "exertion.current": newExertion,
        [`hitDice.${lowestAvailableHitDie}.current`]: newHitDieCount,
      },
    });
  }

  async recoverPsionicPointsUsingHitDice() {
    const { current, max } = this.system.spellResources.points;

    const dieData = Object.entries(this.system.attributes.hitDice ?? {}).find(
      // @ts-expect-error
      ([, { current: c, total: t }]) => c > 0 && t > 0,
    );

    if (!dieData) {
      ui.notifications.warn(`${this.name} has no hit dice remaining.`);
      return;
    }

    const [die] = dieData;
    const roll = new Roll(`1${die}`);

    // TODO: Chat Cards - Make the message prettier
    await roll.toMessage();

    //@ts-expect-error
    const newPsionicPoints = Math.min((current ?? 0) + (roll.total ?? 0), max);
    this.HitDiceManager.consumeHitDice({ [die]: 1 });

    this.update({
      "system.spellResources.points.current": newPsionicPoints,
    });
  }

  // -------------------------------------------------------------
  // Sheet Toggles
  // -------------------------------------------------------------
  toggleInspiration() {
    const currentState = this.system.attributes.inspiration;
    this.update({ "system.attributes.inspiration": !currentState });

    if (currentState) {
      Hooks.callAll("a5e.inspirationUsed", this);
    } else {
      Hooks.callAll("a5e.inspirationGained", this);
    }
  }

  // -------------------------------------------------------------
  // Fix Nested UUIDs in Grants
  // -------------------------------------------------------------
    async _fixNestedUuids() {
    const actorData = this.toObject();
    let modified = false;

    function fixNestedUuids(obj) {
      if (typeof obj !== 'object' || obj === null) return;

      for (const key in obj) {
        const value = obj[key];

        // Check if this is the problematic structure: {uuid: {uuid: "...", ...}, ...}
        if (key === 'uuid' && typeof value === 'object' && value !== null) {
          if (value.uuid && typeof value.uuid === 'string') {
            const innerUuid = value.uuid;
            const limitedReselection = value.limitedReselection;
            const selectionLimit = value.selectionLimit;

            obj.uuid = innerUuid;

            if (obj.limitedReselection === undefined && limitedReselection !== undefined) {
              obj.limitedReselection = limitedReselection;
            }
            if (obj.selectionLimit === undefined && selectionLimit !== undefined) {
              obj.selectionLimit = selectionLimit;
            }

            modified = true;
          }
        } else if (typeof value === 'object') {
          // Recursively check nested objects
          fixNestedUuids(value);
        }
      }
    }

    fixNestedUuids(actorData);

    if (modified) {
      await this.update(actorData);
      console.log(`A5e | Fixed nested UUIDs for actor: ${this.name}`);
    }
  }

  // -------------------------------------------------------------
  // Document Update Hooks
  // -------------------------------------------------------------
  /** @inheritdoc */
  override async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
  }

  /** @inheritdoc */
  override async _preUpdate(changed, options, userId) {
    await super._preUpdate(changed, options, userId);
  }

  /** @inheritdoc */
  override _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);

    if (game.user.id !== userId) return;
    this._fixNestedUuids();
  }

  /** @inheritdoc */
  override _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);
  }
}
