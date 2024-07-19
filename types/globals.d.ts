import type { A5E } from '../src/config';

import A5eGame from '../src/interfaces/A5eGame.interface';

declare global {
  interface AssumeHookRan {
    init: never;
    setup: never;
    ready: never;
  }

  interface CONFIG {
    A5E: typeof A5E
  }

  interface Game {
    a5e: A5eGame;
  }
}

export default something = {};
