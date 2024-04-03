import BaseActorA5E from './base';

/** A `Proxy` to to get Foundry to construct `ActorA5E` subclasses */
export default new Proxy(BaseActorA5E, {
  construct(_target, args) {
    const ActorClass = CONFIG.A5E.Actor.documentClasses[args[0].type] ?? BaseActorA5E;
    return new ActorClass(...args);
  }
});
