import type { Grant } from 'types/grants';

export default function prepareApplyData(
  actor: typeof Actor,
  grants: any[],
  applyData: Map<string, any>
): Record<string, any> {
  let data: Record<string, any> = {};

  grants.forEach(({ id, grant }: { id: string, grant: Grant }) => {
    const inputData = applyData.get(id);
    if (inputData) {
      data = {
        ...data,
        ...grant.getApplyData(actor, inputData)
      };
    }
    else {
      data = {
        ...data,
        ...grant.getApplyData(actor)
      };
    }
  });

  data = foundry.utils.flattenObject(data);
  data = foundry.utils.expandObject(data);

  console.log('prepareApplyData', data);

  return data;
}
