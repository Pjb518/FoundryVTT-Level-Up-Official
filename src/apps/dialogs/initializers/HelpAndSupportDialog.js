import { SvelteApplicationMixin } from "../../../../lib/ApplicationMixin/SvelteApplicationMixin.svelte";

import HelpAndSupportDialogComponent from "../HelpAndSupportDialog.svelte";

export default class HelpAndSupportDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  root = HelpAndSupportDialogComponent;

  static DEFAULT_OPTIONS = {
    classes: ["a5e-help-and-support-dialog"],
    position: { width: 400, height: "auto" },
    window: { title: "Help and Support" },
  };
}
