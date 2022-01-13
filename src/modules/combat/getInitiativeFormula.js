import ReactiveDialog from '../apps/reactiveDialog';
import InitiativeConfig from '../../vue/InitiativeDialog.vue';

/**
 * Override the default Initiative formula to customize special behaviors of the system.
 * See Combat._getInitiativeFormula for more detail.
 * @returns {string}  Final initiative formula for the actor.
 */
export default async function getInitiativeFormula() {
  const { actor } = this;
  const title = game.i18n.format('A5E.InitiativePromptTitle', { name: actor.name });

  const dialog = new ReactiveDialog(InitiativeConfig, { title, props: { actor } });
  await dialog.render(true);

  const { formula } = await dialog.promise;

  return formula;
}
