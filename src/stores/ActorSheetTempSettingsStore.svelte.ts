type ActorSheetTempSetting = {
  currentSpellBook: string;
  currentTab: string;
};

export const actorSheetTempSettings: Record<string, ActorSheetTempSetting> =
  $state({});
export type ActorSheetTempSettings = typeof actorSheetTempSettings;
