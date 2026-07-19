import { MigrationBase } from "../MigrationBase.ts";

const MODES_TO_TYPES = {
  0: "custom",
  1: "multiply",
  2: "add",
  3: "subtract",
  4: "downgrade",
  5: "upgrade",
  6: "override",
  7: "conditional",
}


export class Migration021MigrateEffects extends MigrationBase {
  static override version = 0.021;

  override async updateEffect(source: any, parent?: any): Promise<void> {
    const changes = foundry.utils.duplicate(source.changes);
    const migratedChanges = [] as any[];

    // Update change mode to type
    changes.forEach((change) => {
      const mode = change.mode || 2;
      change.type = MODES_TO_TYPES[mode];
      delete change.mode;

      migratedChanges.push(change);
    });


    // Update source data in system
    foundry.utils.setProperty(source, "system.changes", migratedChanges);
  }
}
