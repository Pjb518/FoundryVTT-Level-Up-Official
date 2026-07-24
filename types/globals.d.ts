import type { A5E } from "../src/config.ts";

import type A5eGame from "../src/interfaces/A5eGame.interface";

declare global {
  interface AssumeHookRan {
    init: never;
  }

  interface AssumeHookRan {
    setup: never;
  }

  interface AssumeHookRan {
    ready: never;
  }

  interface CONFIG {
    A5E: typeof A5E;
  }

  interface Game {
    a5e: A5eGame;
  }

  /* Updated types begin here */
  /** Alias for foundry.data.fields.DataSchema used in TypeDataModel schema declarations */
  type DataSchema = foundry.data.fields.DataSchema;
}

export default (something = {});
