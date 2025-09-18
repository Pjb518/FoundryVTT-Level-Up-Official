import type ClassItemA5e from "./class";
import type { A5EArchetypeData } from "../../dataModels/item/ArchetypeDataModel";
import type { ClassCastingData } from "./data";

import OriginItemA5e from "./origin";

import ClassResourceManager from "../../managers/ClassResourceManager";

export default class ArchetypeItemA5e extends OriginItemA5e {
  declare casting: ClassCastingData | null;

  declare class: ClassItemA5e | null;

  declare resources: ClassResourceManager;

  declare system: InstanceType<typeof A5EArchetypeData>;

  get classLevels() {
    const cls = this.class;
    if (!cls) return 0;

    return cls.system.classLevels;
  }

  get slug(): string {
    return this.system.slug || this.name.slugify({ strict: true });
  }

  override prepareBaseData(): void {
    super.prepareBaseData();

    this.class = this.prepareClass();
    this.resources = new ClassResourceManager(this);
    this.casting = this.prepareCasterData();
  }

  prepareClass(): ClassItemA5e | null {
    if (!this.isEmbedded) return null;

    if (!this.system.class) {
      ui.notifications?.error("Archetype is missing a class reference.");
    }

    const slug = this.system.class;
    const cls: unknown | undefined = this.actor?.items
      // @ts-expect-error
      .find((i) => i.type === "class" && i.slug === slug);

    if (!cls) return null;
    return cls as ClassItemA5e;
  }

  prepareCasterData() {
    const { casterType } = this.system.spellcasting;
    if (!casterType || casterType === "none") return null;

    const progressionConfig = CONFIG.A5E.casterProgression[casterType] ?? null;
    if (!progressionConfig) return null;

    const { type, config, resource, multiplier, roundUp, multiclassMode } =
      progressionConfig;

    const data: ClassCastingData = {
      casterType,
      resource,
      progressionType: type,
    };

    // Add spellcasting resource data
    if (type === "multiplier" && resource === "slots") {
      const roundFunc = Math.ceil;
      const slots =
        config[roundFunc(this.classLevels * (multiplier ?? 1))] ?? [];

      data.slots = Object.fromEntries(
        slots.map((slot: number, idx: number) => {
          const skip = Math.round(1 / multiplier) > this.classLevels;
          if (multiplier < 1 && skip && !roundUp) return [idx + 1, 0];

          return [idx + 1, slot];
        }),
      );
    }

    if (type === "reference") {
      const ref = config[this.classLevels || 1];
      data.multiclassMode = multiclassMode;
      if (resource === "slots") {
        data.slots = { [ref.level]: ref.slots };
      } else if (resource === "points") {
        data.points = ref.points;
        data.maxLevel = ref.level;
      } else if (resource === "inventions") {
        data.inventions = ref.count;
        data.maxLevel = ref.level;
      } else if (resource === "artifactCharges") {
        data.charges = ref.charges;
        data.maxLevel = ref.level;
      }
    }

    return data;
  }

  override getRollData() {
    const data: Record<string, any> = { ...super.getRollData() };
    const resources = this?.resources?.rollData ?? {};

    data.actorTransfer = {
      resources,
      ...resources,
    };

    return data;
  }

  override async _preCreate(data: any, options: any, user: any) {
    super._preCreate(data, options, user);
  }

  override async _preUpdate(changed, options, user) {
    super._preUpdate(changed, options, user);
  }

  override async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
  }

  override _onUpdate(data, options, userId) {
    super._onUpdate(data, options, userId);
  }

  override async _onDelete(options, user) {
    super._onDelete(options, user);
  }
}
