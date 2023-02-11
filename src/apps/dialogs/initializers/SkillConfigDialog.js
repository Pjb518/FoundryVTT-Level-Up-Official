// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import SkillConfigComponent from '../SkillConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class SkillConfigDialog extends TJSDialog {
  constructor(actorDocument, { skillKey }) {
    super({
      title: game.i18n.format(
        'A5E.SkillConfigurationPrompt',
        { name: actorDocument.name, skill: game.i18n.localize(CONFIG.A5E.skills[skillKey]) }
      ),
      content: {
        class: SkillConfigComponent,
        props: { actorDocument, skillKey }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 380,
      height: 600
    });
  }
}
