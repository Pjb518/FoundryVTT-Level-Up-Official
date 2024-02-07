import type { Grant } from 'types/itemGrants';

export default function prepareApplyData(
  actor: typeof Actor,
  grants: any[],
  applyData: Map<string, any>
): Record<string, any> {
  const updateData: Record<string, any> = {};

  grants.forEach(({ id, grant }: { id: string, grant: Grant }) => {
    const inputData = applyData.get(id);
    if (inputData) {
      foundry.utils.mergeObject(updateData, grant.getApplyData(actor, inputData));
    } else {
      foundry.utils.mergeObject(updateData, grant.getApplyData(actor));
    }
  });

  return updateData;
}
