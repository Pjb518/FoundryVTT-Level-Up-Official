import ReactiveDialog from '../apps/reactiveDialog';

/**
 * A helper function for creating a configuration dialog and returning the relevant data.
 *
 * If the dialog is closed without submitting, the returned promise resolves to null. In all
 * other cases, the promise will yield an object containing various pieces of configuration data.
 * The content of this data object is dependent on the app being rendered.
 *
 * Missing pieces of data will have a value of null.
 *
 * @async
 * @param {<Object.<string, any>} data A key that can be used to reference a given skill.
 *
 * @returns {Promise<?Object.<string, ?string>>}
 */
export default async function getDialogData(App, data) {
  const dialog = new ReactiveDialog(App, data);
  dialog.render(true);

  return dialog.promise;
}
