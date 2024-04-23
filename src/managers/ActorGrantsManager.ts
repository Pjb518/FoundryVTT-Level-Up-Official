import type { ActorGrant, TraitGrant } from 'types/actorGrants';
import type { Grant } from 'types/itemGrants';
import type ItemGrantsManager from './ItemGrantsManager';

import GrantCls from '../dataModels/actor/ActorGrants';

import GenericDialog from '../apps/dialogs/initializers/GenericDialog';
import GrantApplicationDialog from '../apps/dialogs/GrantApplicationDialog.svelte';

import prepareTraitGrantConfigObject from '../utils/prepareTraitGrantConfigObject';
import prepareGrantsApplyData from '../utils/prepareGrantsApplyData';

export default class ActorGrantsManger extends Map<string, ActorGrant> {
  private actor: typeof Actor;

  private allowedTypes = ['feature', 'background', 'class', 'culture', 'heritage'];

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
  createInitialGrants(itemId: string): void {
    if (!itemId) return;
    const item = this.actor.items.get(itemId);
    if (!this.allowedTypes.includes(item.type)) return;

    const applicableGrants: Grant[] = [];
    const optionalGrants: Grant[] = [];
    const characterLevel: number = this.actor.levels.character;
    const classLevel: number = this.actor.levels.classes?.[item?.slug] ?? Infinity;

    const grantsManager: ItemGrantsManager = item.grants;
    [...grantsManager.values()].forEach((grant) => {
      if (this.has(grant._id)) return;

      const { levelType } = grant;
      if (levelType === 'character' && grant.level > characterLevel) return;
      if (levelType === 'class' && grant.level > classLevel) return;

      if (grant.optional) optionalGrants.push(grant);
      applicableGrants.push(grant);
    });

    this.#applyGrants(applicableGrants, optionalGrants, item);
  }

  async createLeveledGrants(): Promise<void> {
    const characterLevel: number = this.actor.levels.character;

    const applicableGrants: Grant[] = [];
    const optionalGrants: Grant[] = [];
    const items = this.actor.items
      .filter((item: typeof Item) => this.allowedTypes.includes(item.type));

    for (const item of items) {
      const classLevel: number = this.actor.levels.classes?.[item.slug] ?? Infinity;

      const grantsManager: ItemGrantsManager = item.grants;
      [...grantsManager.values()].forEach((grant) => {
        if (this.has(grant._id)) return;

        const { levelType } = grant;
        if (levelType === 'character' && grant.level !== characterLevel) return;
        if (levelType === 'class' && grant.level !== classLevel) return;

        if (grant.optional) optionalGrants.push(grant);
        applicableGrants.push(grant);
      });
    }

    await this.#applyGrants(applicableGrants, optionalGrants);

    // Remove any grants that are no longer applicable
    this.removeGrantsByLevel(characterLevel);
  }

  async #applyGrants(
    allGrants: Grant[],
    optionalGrants: Grant[],
    item: typeof Item | null = null
  ): Promise<boolean> {
    if (!allGrants.length) return false;

    const requiresDialog = [...allGrants].some((grant) => grant.requiresConfig())
      || !!optionalGrants.length;

    let dialogData: { updateData: any, success: boolean, documentData: Map<string, any[]> };
    if (!requiresDialog) {
      const grants = allGrants.map((grant) => ({ id: grant._id, grant }));
      const { updateData, documentData } = prepareGrantsApplyData(this.actor, grants, new Map());
      dialogData = { success: true, updateData, documentData };
    } else {
      const dialog = new GenericDialog(
        `${this.actor.name} - Apply Grants`,
        GrantApplicationDialog,
        {
          actor: this.actor,
          allGrants,
          optionalGrants
        }
      );

      await dialog.render(true);
      dialogData = await dialog.promise;

      if (!dialogData?.success) {
        if (item) item.delete();
        return false;
      }
    }

    if (dialogData.updateData) await this.actor.update(dialogData.updateData);

    // Create sub items
    if (!dialogData.documentData.size) return true;

    const updateData: Record<string, any> = {};

    for await (const [grantId, docData] of dialogData.documentData) {
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
    return true;
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

  removeGrantsByLevel(level: number): void {
    const updates: Record<string, any> = {};

    for (const [grantId, grant] of this) {
      if (grant.level > level) {
        updates[`system.grants.-=${grantId}`] = null;
        foundry.utils.mergeObject(updates, this.#getRemoveUpdates(grant));
      }
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
          updates[`system.skills.${key}.proficient`] = 0;
        });
      }
    }

    if (grant instanceof GrantCls.feature || grant instanceof GrantCls.item) {
      const ids = grant.documentIds;
      if (!ids?.length) return updates;

      this.actor.deleteEmbeddedDocuments('Item', ids);
    }

    if (grant instanceof GrantCls.skillSpecialty) {
      const { skill } = grant.specialtyData;

      const existing: Set<string> = new Set(
        foundry.utils.getProperty(
          this.actor,
          `system.skills.${skill}.specialties`
        ) as string[] ?? []
      );

      const removals: Set<string> = new Set(grant.specialtyData.specialties);

      updates[`system.skills.${skill}.specialties`] = [...existing.difference(removals)];
    }

    if (grant instanceof GrantCls.trait) {
      const configObject = prepareTraitGrantConfigObject();
      const { propertyKey } = configObject[grant.traitData.traitType] ?? {};
      if (!propertyKey) return {};

      const removals: Set<string> = new Set(grant.traitData.traits);
      const traits = new Set(
        foundry.utils.getProperty(this.actor, propertyKey) as string[] ?? []
      );

      if (grant.traitData.traitType === 'size') updates[propertyKey] = '';
      else updates[propertyKey] = [...traits.difference(removals)];
    }

    return updates;
  }
}
