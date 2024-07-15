import A5eGame from '../src/interfaces/A5eGame.interface';

declare global {
  interface AssumeHookRan {
    init: never;
    setup: never;
    ready: never;
  }

  interface CONFIG {
    A5E: any; // TODO: Types - Update this
  }

  interface Game {
    a5e: A5eGame;
  }
}

export default something = {};
