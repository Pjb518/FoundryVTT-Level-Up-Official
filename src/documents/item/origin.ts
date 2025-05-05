import { BaseItemA5e } from "./base.svelte.ts";

// import ItemGrantsManager from '../../managers/ItemGrantsManager';

export default class OriginItemA5e extends BaseItemA5e {
  declare grants: ItemGrantsManager;

  override prepareBaseData() {
    super.prepareBaseData();

    // Setup Grants System
    this.grants = new ItemGrantsManager(this);
  }

  override async _preCreate(data, options, user): Promise<boolean | void> {
    if (user._id !== game.userId) {
      super._preCreate(data, options, user);
      return;
    }

    // Apply grants if any
    if (this.parent && this.parent.documentName === "Actor") {
      const actor = this.parent;
      // Keep id of the original document
      options.keepId = true;
      // @ts-expect-error
      if (!options.noGrant) actor.grants.createInitialGrants(this, false);
    }

    await super._preCreate(data, options, user);
  }

  override async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
  }

  override async _onDelete(options, userId) {
    super._onDelete(options, userId);

    if (!this.parent || this.parent?.documentName !== "Actor") return;

    const actor = this.parent;
    // @ts-expect-error
    await actor.grants.removeGrantsByItem(this.uuid);
  }
}
