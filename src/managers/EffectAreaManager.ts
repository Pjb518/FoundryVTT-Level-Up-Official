import type { Action } from "#types/action.js";
import type { Consumers } from "#types/consumers.js";
import { getDeterministicBonus } from "../dice/getDeterministicBonus.ts";

class EffectAreaManager {
  #action: Action;

  #actor: Actor;

  #consumers: Consumers;

  #item: Item;

  constructor(
    actor: Actor,
    item: Item,
    action: Actor,
    consumers = {} as Consumers,
  ) {
    this.#action = action;
    this.#actor = actor;
    this.#consumers = consumers;
    this.#item = item;
  }

  getShapeData() {
    const { area } = this.#action;
    let scaledArea = foundry.utils.duplicate(area);
    scaledArea = this.#applyTemplateScaling(scaledArea);

    const data = this.#getRegionData(scaledArea);
    return canvas.regions.placeRegion(data);
  }

  validateBaseTemplateData(action = this.#action) {
    const { area } = action ?? {};
    if (foundry.utils.isEmpty(area)) return false;
    area.quantity ??= 1;

    if (!area.shape) return false;
    if (area.quantity <= 0) return false;

    // Validate separately
    if (area.shape === "cone") return this.#validateCone(area);
    if (["cube", "square"].includes(area.shape))
      return this.#validateQuadrilateral(area);
    if (["circle", "emanation", "sphere"].includes(area.shape))
      return this.#validateRadialObject(area);
    if (area.shape === "cylinder") return this.#validateCylinder(area);
    if (area.shape === "line") return this.#validateLine(area);
    if (area.shape === "wall") return this.#validateWall(area);
    return false;
  }

  // --------------------------------------------
  // Internal Functions - Validators
  // --------------------------------------------
  #validateCone(area) {
    const length = parseInt(area?.length, 10);
    if (!length || length <= 0) return false;

    return true;
  }

  #validateQuadrilateral(area) {
    const size = parseInt(area?.width, 10);
    if (!size || size <= 0) return false;

    return true;
  }

  #validateRadialObject(area) {
    const radius = parseInt(area?.radius, 10);
    if (!radius || radius <= 0) return false;

    return true;
  }

  #validateCylinder(area) {
    const radius = parseInt(area?.radius, 10);
    const height = parseInt(area?.radius, 10);

    if (!radius || !height) return false;
    if (radius <= 0 || height <= 0) return false;

    return true;
  }

  #validateLine(area) {
    const length = parseInt(area?.length, 10);
    const width = parseInt(area?.width, 10);

    if (!width || !length) return false;
    if (width <= 0 || length <= 0) return false;

    return true;
  }

  #validateWall(area) {
    const length = parseInt(area?.length, 10);
    const width = parseInt(area?.width, 10);
    const height = parseInt(area?.height, 10);

    if (!width || !length || !height) return false;
    if (width <= 0 || length <= 0 || height <= 0) return false;

    return true;
  }

  // --------------------------------------------
  // Internal Functions - Scaling
  // --------------------------------------------
  #getRegionData(area) {
    const { shape } = area;

    let regionData = {
      name: this.#item.name,
      shapes: [] as any[],
      color: game.user.color.toString(),
      highlightMode: "coverage",
      displayMeasurements: true,
      ownership: { [game.user.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER },
      visibility: CONST.REGION_VISIBILITY.ALWAYS,
    };

    const { x, y } = canvas.mousePosition;

    switch (shape) {
      case "circle":
      case "cylinder":
      case "sphere": {
        const radius = (area.radius / 5) * canvas.grid.size;
        regionData.shapes = [{ type: "circle", radius, x, y }];
        break;
      }
      case "cone": {
        const radius = (area.length / 5) * canvas.grid.size;
        regionData.shapes = [{ type: "cone", angle: 90, radius, x, y }];
        break;
      }
      case "cube":
      case "square": {
        const width = (area.width / 5) * canvas.grid.size;
        const height = width;
        regionData.shapes = [{ type: "rectangle", width, height, x, y }];
        break;
      }
      case "line":
      case "wall": {
        const length = (area.length / 5) * canvas.grid.size;
        const width = (area.width / 5) * canvas.grid.size;
        regionData.shapes = [{ type: "line", length, width, x, y }];
        break;
      }
      case "emanation": {
        const tokenSource = this.#actor
          .getActiveTokens(true, true)
          .at(0)?._source;
        if (!tokenSource) return null;
        const base = {
          width: tokenSource.width,
          height: tokenSource.height,
          x: tokenSource.x,
          y: tokenSource.y,
          shape: tokenSource.shape,
          type: "token",
        };
        const radius = (area.radius / 5) * canvas.grid.size;
        regionData.shapes = [{ type: "emanation", radius, base, x, y }];
        break;
      }
    }

    return regionData;
  }

  #applyTemplateScaling(area) {
    const scalingMode = area.scaling?.mode;
    if (!scalingMode) return area;

    if (scalingMode === "cantrip") return this.#applyCantripScaling(area);
    if (scalingMode === "spellLevel") return this.#applySpellLevelScaling(area);
    if (scalingMode === "spellPoints")
      return this.#applySpellPointScaling(area);
    if (scalingMode === "artifactCharges")
      return this.#applyArtifactChargesScaling(area);
    if (scalingMode === "actionUses") return this.#applyActionUsesScaling(area);
    if (scalingMode === "itemUses") return this.#applyItemUsesScaling(area);

    return area;
  }

  #applyCantripScaling(area) {
    const actorData = this.#actor.system;
    const casterLevel =
      actorData.details.level ?? actorData.attributes.casterLevel;
    if (casterLevel < 5) return area;

    const properties = [
      "quantity",
      ...EffectAreaManager.getShapeProperties(area.shape),
    ];
    let multiplier = 0;

    if (casterLevel >= 17) multiplier = 3;
    else if (casterLevel >= 11) multiplier = 2;
    else if (casterLevel >= 5) multiplier = 1;

    // Apply scaling to properties
    properties.forEach((property) => {
      const scalingFormula =
        getDeterministicBonus(
          area.scaling?.formula?.[property] ?? 0,
          this.#actor.getRollData(this.#item),
        ) ?? 1;

      area[property] =
        parseInt(area[property], 10) + scalingFormula * multiplier;
    });

    return area;
  }

  #applySpellLevelScaling(area) {
    const baseSpellLevel = this.#item.system.level;
    const castingLevel = this.#consumers.spell?.level ?? baseSpellLevel;
    const delta = castingLevel - baseSpellLevel;

    return this.#applyResourceBasedScaling(area, delta);
  }

  #applySpellPointScaling(area) {
    const spellConsumer = this.#consumers.spell;
    if (foundry.utils.isEmpty(spellConsumer)) return area;

    const { basePoints } = spellConsumer;
    if (basePoints >= spellConsumer.points) return area;

    const delta = Math.max(0, spellConsumer.points - basePoints);
    return this.#applyResourceBasedScaling(area, delta);
  }

  #applyArtifactChargesScaling(area) {
    const spellConsumer = this.#consumers.spell;
    if (foundry.utils.isEmpty(spellConsumer)) return area;

    const { baseCharges } = spellConsumer;
    if (baseCharges >= spellConsumer.charges) return area;

    const delta = Math.max(0, spellConsumer.charges - baseCharges);
    return this.#applyResourceBasedScaling(area, delta);
  }

  #applyActionUsesScaling(area) {
    const actionConsumer = this.#consumers.actionUses;
    if (foundry.utils.isEmpty(actionConsumer)) return area;

    const baseQuantity = actionConsumer.baseUses;
    if (baseQuantity >= actionConsumer.quantity) return area;

    const delta = actionConsumer.quantity - baseQuantity;
    return this.#applyResourceBasedScaling(area, delta);
  }

  #applyItemUsesScaling(area) {
    const itemConsumer = this.#consumers.itemUses;
    if (foundry.utils.isEmpty(itemConsumer)) return area;

    const baseQuantity = itemConsumer.baseUses;
    if (baseQuantity >= itemConsumer.quantity) return area;

    const delta = itemConsumer.quantity - baseQuantity;
    return this.#applyResourceBasedScaling(area, delta);
  }

  #applyResourceBasedScaling(area, delta) {
    const { shape, scaling } = area;
    if (!delta || foundry.utils.isEmpty(scaling)) return area;

    const properties = [
      "quantity",
      ...EffectAreaManager.getShapeProperties(shape),
    ];
    const step = area.scaling?.step || 1;
    const multiplier = Math.floor(delta / step);

    if (multiplier === 0) return area;

    // Apply scaling to properties
    properties.forEach((property) => {
      const scalingFormula =
        getDeterministicBonus(
          area.scaling?.formula?.[property] ?? 0,
          this.#actor.getRollData(this.#item),
        ) ?? 1;

      area[property] =
        parseInt(area[property], 10) + scalingFormula * multiplier;
    });

    return area;
  }

  // --------------------------------------------
  // Static Functions
  // --------------------------------------------
  static getShapeProperties(shape) {
    switch (shape) {
      case "circle":
      case "emanation":
      case "sphere":
        return ["radius"];
      case "cone":
        return ["length"];
      case "cube":
      case "square":
        return ["width"];
      case "cylinder":
        return ["radius", "height"];
      case "line":
        return ["length", "width"];
      case "wall":
        return ["length", "height", "width"];
      default:
        return [];
    }
  }
}

export { EffectAreaManager };
