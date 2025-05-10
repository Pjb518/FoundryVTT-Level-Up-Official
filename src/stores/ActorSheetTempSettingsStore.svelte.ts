export type ActorSheetTempSetting = {
  currentSpellBook: string;
  currentNotesTab: string;
  currentSettingsTab: string;
  currentTab: string;
};

export const actorSheetTempSettings: Record<string, ActorSheetTempSetting> =
  $state({});
export type ActorSheetTempSettings = typeof actorSheetTempSettings;
