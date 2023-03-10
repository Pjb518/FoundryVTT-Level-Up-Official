import migrateActorBonuses from './actorData/migrateActorBonuses';
import migrateMovements from './actorData/migrateMovements';
import migrateSenses from './actorData/migrateSenses';

import migrateActionsConfig from './itemData/migrateActionsConfig';
import migrateItemWeight from './itemData/migrateItemWeight';

export const migrateActorData = [
  migrateActorBonuses, migrateMovements, migrateSenses
];

export const migrateItemData = [migrateActionsConfig, migrateItemWeight];
