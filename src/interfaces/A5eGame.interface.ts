// Actor Sheets
import type ActorSheet from '../apps/ActorSheet';
import type ItemSheet from '../apps/ItemSheet';
import type EffectOption from '../documents/activeEffect/EffectOption';

// CompendiumSheets
import type DND5ESpellCompendiumSheet from '../apps/DND5ESpellCompendiumSheet';
import type ItemCompendiumSheet from '../apps/ItemCompendiumSheet';
import type ManeuverCompendiumSheet from '../apps/ManeuverCompendiumSheet';
import type MonsterCompendiumSheet from '../apps/MonsterCompendiumSheet';
import type SpellCompendiumSheet from '../apps/SpellCompendiumSheet';

// Macros
import type activateActionMacro from '../macros/activateActionMacro';
import type activateItemMacro from '../macros/activateItemMacro';
import type createMacro from '../macros/createMacro';

// Managers
import type { ActionsManager } from '../managers/ActionsManager';
import type ContainerManager from '../managers/ContainerManager';
import type ForeignDocumentManager from '../managers/ForeignDocumentManager';
import type HitDiceManager from '../managers/HitDiceManager';
import type ItemGrantsManager from '../managers/ItemGrantsManager';
import type ModifierManager from '../managers/ModifierManager';
import type ResourceConsumptionManager from '../managers/ResourceConsumptionManager';
import type RestManager from '../managers/RestManager';
import type { RollPreparationManager } from '../managers/RollPreparationManager';
import type TemplatePreparationManager from '../managers/TemplatePreparationManager';

// Stores
import type { gameSettings } from '../settings/SettingsStore';

import type D20Roll from '../dice/d20Roll';

export default interface A5eGame {
  applications: {
    ActorSheetA5e: typeof ActorSheet;
    ItemSheetA5e: typeof ItemSheet;
  };
  activeEffects: {
    EffectOption: typeof EffectOption;
    options: Record<string, any>;
    effectsPanel: any; // TODO: Types - FIx this
  };
  compendiumSheets: {
    DND5ESpellCompendiumSheet: typeof DND5ESpellCompendiumSheet;
    ItemCompendiumSheet: typeof ItemCompendiumSheet;
    ManeuverCompendiumSheet: typeof ManeuverCompendiumSheet;
    MonsterCompendiumSheet: typeof MonsterCompendiumSheet;
    SpellCompendiumSheet: typeof SpellCompendiumSheet;
  };
  config: typeof CONFIG.A5E;
  dice: {
    D20Roll: typeof D20Roll;
  };
  documentClasses: any; // TODO: Types - Fix this
  dialogs: {
    bonuses: {
      abilities: Record<string, any>;
      damage: Record<string, any>;
      healing: Record<string, any>;
      skills: Record<string, any>;
    };
  };
  macros: {
    activateActionMacro: typeof activateActionMacro;
    activateItemMacro: typeof activateItemMacro;
    createMacro: typeof createMacro;
  };
  managers: {
    ActionsManager: typeof ActionsManager
    ContainerManager: typeof ContainerManager;
    ForeignDocumentManager: typeof ForeignDocumentManager;
    HitDiceManager: typeof HitDiceManager;
    ItemGrantsManager: typeof ItemGrantsManager;
    ModifierManager: typeof ModifierManager;
    ResourceConsumptionManager: typeof ResourceConsumptionManager;
    RestManager: typeof RestManager;
    RollPreparationManager: typeof RollPreparationManager;
    TemplatePreparationManager: typeof TemplatePreparationManager;
  };
  migrations: any; // TODO: Types - Fix this
  settings: {
    store: typeof gameSettings;
  };
  utils: {
    getDeterministicBonus: any;
    compendiaIndexFunctions: any;
    openCompendium: any;
  };
}
