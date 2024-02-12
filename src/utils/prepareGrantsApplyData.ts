import type { Grant } from 'types/itemGrants';

export default function prepareApplyData(
  actor: typeof Actor,
  grants: any[],
  applyData: Map<string, any>
): Record<string, any> {
  const updateData: Record<string, any> = {};
  const documentData: Map<string, string[]> = new Map();

  grants.forEach(({ id, grant }: { id: string, grant: Grant }) => {
    const inputData = applyData.get(id);

    if (['feature', 'item'].includes(grant.grantType)) {
      const data = grant.getApplyData(actor, inputData);
      const uuids = inputData?.uuids ?? grant?.[grant.grantType]?.base ?? [];
      documentData.set(id, uuids);

      foundry.utils.mergeObject(updateData, (data ?? {}));
      return;
    }

    if (inputData) {
      foundry.utils.mergeObject(updateData, grant.getApplyData(actor, inputData));
    } else {
      foundry.utils.mergeObject(updateData, grant.getApplyData(actor));
    }
  });

  return { updateData, documentData };
}
