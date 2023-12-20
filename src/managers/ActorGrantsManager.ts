import type { Grant } from 'types/grants';
import type ItemGrantsManager from './ItemGrantsManager';

type ActorGrantData = {
  bonusId: string,
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

  async applyGrants(): Promise<void> {
    const appliedGrants = [...this.values()].map(({ itemUuid, grantId }) => `${itemUuid}.${grantId}`);
    const applicableGrants: Grant[] = [];

    for await (const item of this.actor.items) {
      if (item.type !== 'feature') continue;

      const grantsManager: ItemGrantsManager = item.grants;
      const grants = [...grantsManager.values()].reduce((acc: Grant[], grant) => {
        const id = `${item.uuid}.${grant._id}`;
        if (appliedGrants.includes(id)) return acc;
        acc.push(grant);
        return acc;
      }, []);

      applicableGrants.push(...grants);
    }

    for await (const grant of applicableGrants) {
      await grant.applyGrant();
    }
  }
}
