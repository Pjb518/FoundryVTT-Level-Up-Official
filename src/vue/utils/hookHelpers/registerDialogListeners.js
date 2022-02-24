export default function registerDialogListeners(appId, hooks, updateFunction) {
  const registeredHooks = hooks.reduce((hookIDs, hook) => {
    hookIDs[hook] = Hooks.on(hook, () => updateFunction());
    return hookIDs;
  }, {});

  const closeSheetHookID = Hooks.on('closeApplication', (dialogData) => {
    if (`app-${dialogData.appId}` === appId) {
      Object.entries(registeredHooks).forEach(([name, id]) => {
        Hooks.off(name, id);
      });

      Hooks.off('closeApplication', closeSheetHookID);
    }
  });
}
