import type { Grant } from 'types/itemGrants';

export default function prepareApplyData(
  actor: typeof Actor,
  grants: any[],
  applyData: Map<string, any>
): Record<string, any> {
  const updateData: Record<string, any> = {};
  const documentData: Map<string, any[]> = new Map();

  grants.forEach(({ id, grant }: { id: string, grant: Grant }) => {
    const inputData = applyData.get(id);

    if (grant.grantType === 'feature') {
      const data = grant.getApplyData(actor, inputData);
      const uuids: string[] = inputData?.uuids ?? grant.features.base.map(({ uuid }) => uuid) ?? [];

      const temp = uuids.map((uuid: string) => ({ uuid, type: 'feature' }));
      documentData.set(id, temp);

      foundry.utils.mergeObject(updateData, (data ?? {}));
      return;
    }

    if (grant.grantType === 'item') {
      const data = grant.getApplyData(actor, inputData);
      const uuids: string[] = inputData?.uuids ?? grant.items.base.map(({ uuid }) => uuid) ?? [];

      // Get quantity overrides from the grant
      const allOptions = [...grant.items.base, ...grant.items.options];
      const temp = allOptions.reduce((acc: any[], { uuid, quantityOverride }) => {
        if (!uuids.includes(uuid)) return acc;

        acc.push({ uuid, type: 'object', quantity: quantityOverride });
        return acc;
      }, []);

      documentData.set(id, temp);
      foundry.utils.mergeObject(updateData, (data ?? {}));

      return;
    }

    let grantUpdates;
    if (inputData) {
      grantUpdates = grant.getApplyData(actor, inputData);
    } else {
      grantUpdates = grant.getApplyData(actor);
    }

    // Manually merge arrays from updateData
    Object.entries(grantUpdates ?? {}).forEach(([key, value]) => {
      if (!Array.isArray(value)) return;

      const originalValue = (foundry.utils.getProperty(updateData, key) as string[]) ?? [];
      const newValue = [...new Set([...originalValue, ...(value as any[])])];
      grantUpdates[key] = newValue;
    });

    foundry.utils.mergeObject(updateData, grantUpdates);
  });

  return { updateData, documentData };
}
