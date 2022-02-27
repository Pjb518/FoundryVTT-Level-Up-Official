export default function registerSheetListeners(appId, document, hooks, updateFunction) {
  const registeredHooks = hooks.reduce((hookIDs, hook) => {
    hookIDs[hook] = Hooks.on(hook, (target, diff) => {
      if (target?.parent?.id === document.id || diff._id === document.id) {
        return updateFunction();
      }

      return null;
    });

    return hookIDs;
  }, {});

  const sheetCloseHookName = `close${document.documentName}Sheet`;

  const closeSheetHookID = Hooks.on(sheetCloseHookName, (sheetData) => {
    if (sheetData.appId === appId) {
      Object.entries(registeredHooks).forEach(([name, id]) => {
        Hooks.off(name, id);
      });

      Hooks.off(sheetCloseHookName, closeSheetHookID);
    }
  });
}
