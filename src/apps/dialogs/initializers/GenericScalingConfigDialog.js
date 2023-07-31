import { TJSDocument } from '#runtime/svelte/store/fvtt/document';
import { TJSDialog } from '#runtime/svelte/application';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class TargetScalingConfigDialog extends TJSDialog {
  constructor(item, actionId, title, component, options = {}) {
    super({
      title,
      content: {
        class: component,
        props: { item: new TJSDocument(item), actionId }
      }
    }, {
      classes: ['a5e-sheet'],
      width: options.width ?? 432
    });

    this.data.content.props.dialog = this;
  }
}
