import type { ActorGrant, Grant } from 'types/grants';
import type ItemGrantsManager from './ItemGrantsManager';

import GrantCls from '../dataModels/actor/ActorGrants';

import GenericDialog from '../apps/dialogs/initializers/GenericDialog';
import GrantApplicationDialog from '../apps/dialogs/GrantApplicationDialog.svelte';

export default class ActorGrantsManger extends Map<string, ActorGrant> {
  private actor: typeof Actor;

  constructor(actor: typeof Actor) {
    super();

    this.actor = actor;

    const grantsData: Record<string, ActorGrant> = this.actor.system.grants ?? {};
    Object.entries(grantsData).forEach(([id, data]) => {
      let Cls = GrantCls[data.grantType];

      // eslint-disable-next-line no-console
      if (!Cls) console.warn(`Grant ${id} has no class mapping.`);
      Cls ??= GrantCls.base;
      const grant: any = new Cls(data, { parent: actor });

      this.set(id, grant);
    });
  }

  byType(type: string): ActorGrant[] {
    return [...this.values()].filter((grant) => grant.grantType === type);
  }

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

    if (!applicableGrants.length) return;

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

    for (const [grantId, grant] of this) {
      if (grant.itemUuid !== itemUuid) continue;

      updates[`system.grants.-=${grantId}`] = null;

      if (grant instanceof GrantCls.bonus) {
        if (grant.bonusId) {
          updates[`system.bonuses.${grant.type}.-=${grant.bonusId}`] = null;
        }
      }
    }

    this.actor.update(updates);
  }

  removeGrant(grantId: string): void {
    const grant = this.get(grantId);
    if (!grant) return;

    const updates: Record<string, null> = {
      [`system.grants.-=${grantId}`]: null
    };

    if (grant instanceof GrantCls.bonus) {
      if (grant.bonusId) updates[`system.bonuses.${grant.type}.-=${grant.bonusId}`] = null;
    }

    this.actor.update(updates);
  }
}
