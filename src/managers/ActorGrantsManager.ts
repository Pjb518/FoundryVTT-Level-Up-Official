import type { ActorGrant, TraitGrant } from 'types/actorGrants';
import type { Grant } from 'types/itemGrants';
import type ItemGrantsManager from './ItemGrantsManager';

import GrantCls from '../dataModels/actor/ActorGrants';

import GenericDialog from '../apps/dialogs/initializers/GenericDialog';
import GrantApplicationDialog from '../apps/dialogs/GrantApplicationDialog.svelte';
import prepareTraitGrantConfigObject from '../utils/prepareTraitGrantConfigObject';

export default class ActorGrantsManger extends Map<string, ActorGrant> {
  private actor: typeof Actor;

  private allowedTypes = ['feature', 'background', 'culture', 'heritage'];

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

  // *************************************************************
  // Data Retrieval Methods
  // *************************************************************
  getGrantedTraits(type: string): Record<string, any> {
    const grants = this.byType('trait') as TraitGrant[];

    return grants.reduce((acc, grant) => {
      if (grant.traitData.traitType !== type) return acc;

      acc[grant.grantId] = {
        itemId: grant.itemUuid,
        traits: grant.traitData.traits
      };

      return acc;
    }, {});
  }

  // *************************************************************
  // Update Methods
  // *************************************************************
  async applyGrant(itemId: string): Promise<void> {
    if (!itemId) return;
    const item = this.actor.items.get(itemId);
    if (!this.allowedTypes.includes(item.type)) return;

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
    const promise: {
      updateData: any,
      success: boolean,
      documentData: Map<string, any[]>
    } = await dialog.promise;

    if (!promise?.success) {
      item.delete();
      return;
    }

    if (promise.updateData) await this.actor.update(promise.updateData);

    // Create sub items
    if (!promise.documentData.size) return;

    const updateData: Record<string, any> = {};

    for await (const [grantId, docData] of promise.documentData) {
      const docs = await Promise.all(
        docData.map(async ([uuid, quantity]: [string, number | null]) => {
          const doc = (await fromUuid(uuid)).toObject();
          if (!quantity) return doc;

          doc.system.quantity = quantity;
          return doc;
        })
      );

      const ids = (await this.actor.createEmbeddedDocuments('Item', docs)).map((i: any) => i.id);
      updateData[`system.grants.${grantId}.documentIds`] = ids;
    }

    await this.actor.update(updateData);
  }

  removeGrantsByItem(itemUuid: string): void {
    const updates: Record<string, any> = {};

    for (const [grantId, grant] of this) {
      if (grant.itemUuid !== itemUuid) continue;

      updates[`system.grants.-=${grantId}`] = null;
      foundry.utils.mergeObject(updates, this.#getRemoveUpdates(grant));
    }

    this.actor.update(updates);
  }

  removeGrant(grantId: string): void {
    const grant = this.get(grantId);
    if (!grant) return;

    const updates: Record<string, any> = {
      [`system.grants.-=${grantId}`]: null,
      ...this.#getRemoveUpdates(grant)
    };

    this.actor.update(updates);
  }

  #getRemoveUpdates(grant: ActorGrant): Record<string, any> {
    const updates: Record<string, any> = {};

    if (grant instanceof GrantCls.bonus) {
      if (grant.bonusId) updates[`system.bonuses.${grant.type}.-=${grant.bonusId}`] = null;
    }

    if (grant instanceof GrantCls.proficiency) {
      const { keys, proficiencyType } = grant.proficiencyData;

      if (proficiencyType === 'ability') {
        keys.forEach((key: string) => {
          updates[`system.abilities.${key}.save.proficient`] = false;
        });
      } else if (proficiencyType === 'skill') {
        keys.forEach((key: string) => {
          updates[`system.skills.${key}.proficient`] = false;
        });
      }
    }

    if (grant instanceof GrantCls.feature || grant instanceof GrantCls.item) {
      const ids = grant.documentIds;
      if (!ids?.length) return updates;

      this.actor.deleteEmbeddedDocuments('Item', ids);
    }

    if (grant instanceof GrantCls.trait) {
      const configObject = prepareTraitGrantConfigObject();
      const { propertyKey } = configObject[grant.traitData.traitType] ?? {};
      if (!propertyKey) return {};

      const removals: Set<string> = new Set(grant.traitData.traits);
      const traits = new Set(
        foundry.utils.getProperty(this.actor, propertyKey) as string[] ?? []
      );

      updates[propertyKey] = [...traits.difference(removals)];
    }

    return updates;
  }
}
