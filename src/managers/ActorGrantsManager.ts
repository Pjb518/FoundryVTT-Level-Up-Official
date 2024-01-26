import type { Grant } from 'types/grants';
import type ItemGrantsManager from './ItemGrantsManager';

import GenericDialog from '../apps/dialogs/initializers/GenericDialog';
import GrantApplicationDialog from '../apps/dialogs/GrantApplicationDialog.svelte';

type ActorGrantData = {
  bonusId?: string,
  grantId: string,
  itemUuid: string,
  type: string,
};

export default class ActorGrantsManger extends Map<string, ActorGrantData> {
  private actor: typeof Actor;

  constructor(actor: typeof Actor) {
    super();

    this.actor = actor;

    const grantsData: Record<string, ActorGrantData> = this.actor.system.grants ?? {};
    Object.entries(grantsData).forEach(([id, data]) => {
      this.set(id, data);
    });
  }

  // async applyGrants(): Promise<void> {
  // eslint-disable-next-line max-len
  //   const appliedGrants = [...this.values()].map(({ itemUuid, grantId }) => `${itemUuid}.${grantId}`);
  //   const applicableGrants: Grant[] = [];
  //   const optionalGrants: Grant[] = [];

  //   for await (const item of this.actor.items) {
  //     if (item.type !== 'feature') continue;

  //     const grantsManager: ItemGrantsManager = item.grants;
  //     [...grantsManager.values()].forEach((grant) => {
  //       const id = `${item.uuid}.${grant._id}`;
  //       if (appliedGrants.includes(id)) return;

  //       if (grant.optional) optionalGrants.push(grant);
  //       applicableGrants.push(grant);
  //     });
  //   }

  //   const dialog = new GenericDialog(
  //     `${this.actor.name} - Apply Grants`,
  //     GrantApplicationDialog,
  //     {
  //       actor: this.actor,
  //       allGrants: applicableGrants,
  //       optionalGrants
  //     }
  //   );
  //   dialog.render(true);
  // }

  async applyGrant(itemId: string): Promise<void> {
    if (!itemId) return;
    const item = this.actor.items.get(itemId);
    if (item.type !== 'feature') return;

    const applicableGrants: Grant[] = [];
    const optionalGrants: Grant[] = [];

    const grantsManager: ItemGrantsManager = item.grants;
    [...grantsManager.values()].forEach((grant) => {
      const id = `${item.uuid}.${grant._id}`;
      if (this.has(id)) return;

      if (grant.optional) optionalGrants.push(grant);
      applicableGrants.push(grant);
    });

    const dialog = new GenericDialog(
      `${this.actor.name} - Apply Grants`,
      GrantApplicationDialog,
      {
        actor: this.actor,
        allGrants: applicableGrants,
        optionalGrants
      }
    );

    await dialog.render(true);
    const promise = await dialog.promise;

    if (!promise?.success) {
      item.delete();
      return;
    }

    this.actor.update(promise.updateData);
  }

  removeGrantsByItem(itemUuid: string): void {
    const updates: Record<string, null> = {};

    for (const [grantId, data] of this) {
      if (data.itemUuid !== itemUuid) continue;

      updates[`system.grants.-=${grantId}`] = null;
      if (data.bonusId) updates[`system.bonuses.${data.type}.-=${data.bonusId}`] = null;
    }

    this.actor.update(updates);
  }

  removeGrant(grantId: string): void {
    const data = this.get(grantId);
    if (!data) return;

    const updates: Record<string, null> = {
      [`system.grants.-=${grantId}`]: null
    };

    if (data.bonusId) updates[`system.bonuses.${data.type}.-=${data.bonusId}`] = null;

    this.actor.update(updates);
  }
}
