export default function registerSheetListeners({
  appId, documentId, documentType, hooks, updateFunction
}) {
  const registeredHooks = hooks.reduce((hookIDs, hook) => {
    hookIDs[hook] = Hooks.on(hook, (target, diff) => {
      if (target?.parent?.id === documentId || diff._id === documentId) {
        return updateFunction();
      }

      return null;
    });

    return hookIDs;
  }, {});

  const sheetCloseHookName = `close${documentType}Sheet`;

  const closeSheetHookID = Hooks.on(sheetCloseHookName, (sheetData) => {
    if (sheetData.appId === appId) {
      Object.entries(registeredHooks).forEach(([name, id]) => {
        Hooks.off(name, id);
      });

      Hooks.off(sheetCloseHookName, closeSheetHookID);
    }
  });
}
