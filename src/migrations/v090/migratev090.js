import migrateActorBonuses from './actorData/migrateActorBonuses';
import migrateMovements from './actorData/migrateMovements';
import migrateSenses from './actorData/migrateSenses';

import migrateActionsConfig from './itemData/migrateActionsConfig';
import migrateItemWeight from './itemData/migrateItemWeight';

export const actorMigrators = [
  migrateActorBonuses, migrateMovements, migrateSenses
];

export const itemMigrators = [migrateActionsConfig, migrateItemWeight];
