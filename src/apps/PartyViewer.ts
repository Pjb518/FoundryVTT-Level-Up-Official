import { localize } from "#utils/localization/localize.ts";
// import { TJSDialog } from "#runtime/svelte/application";

// import { gameSettings } from "../settings/SettingsStore";

// import PartyViewerComponent from "./sheets/PartyViewer.svelte";

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class PartyViewer extends TJSDialog {
  constructor() {
    super(
      {
        title: localize("Party Viewer"),
        content: {
          class: null, // PartyViewerComponent,
          props: {
            // @ts-expect-error
            settings: gameSettings,
          },
        },
        resizable: true,
        zIndex: null,
      },
      {
        classes: ["a5e-sheet", "a5e-sheet--party-viewer"],
        width: 672,
      },
    );

    // @ts-expect-error
    this.data.content.props.sheet = this;
  }

  close() {
    game.a5e.dialogs.partyViewer = null;
    // @ts-expect-error
    super.close();
  }
}
