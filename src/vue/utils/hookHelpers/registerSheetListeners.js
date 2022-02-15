export default function registerSheetListeners(appId, hooks, updateFunction) {
  const registeredHooks = hooks.reduce((hookIDs, hook) => {
    hookIDs[hook] = Hooks.on(hook, () => updateFunction());
    return hookIDs;
  }, {});

  const closeSheetHookID = Hooks.on('closeActorSheet', (sheetData) => {
    if (sheetData.appId === appId) {
      Object.entries(registeredHooks).forEach(([name, id]) => {
        Hooks.off(name, id);
      });

      Hooks.off('closeActorSheet', closeSheetHookID);
    }
  });
}
