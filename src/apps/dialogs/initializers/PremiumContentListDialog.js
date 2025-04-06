import { SvelteApplicationMixin } from "../../../../lib/ApplicationMixin/SvelteApplicationMixin.svelte";

import PremiumContentListDialogComponent from "../PremiumContentListDialog.svelte";

export default class PremiumContentListDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  root = PremiumContentListDialogComponent;

  static DEFAULT_OPTIONS = {
    classes: ["a5e-premium-content-list-dialog"],
    position: { width: 500, height: "auto" },
    window: {
      title: "Premium Content",
    },
  };
}
