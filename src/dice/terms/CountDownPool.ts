import { BasePoolTerm } from './BasePoolTerm.ts';

import terms = foundry.dice.terms;

class CountDownPool extends BasePoolTerm {
	declare options: CountDownPool.Options;

	constructor(terms?: terms.PoolTerm.PoolTermConstructorData) {
		console.log(terms);
		super(terms);
	}

	get isValid() {
		return this.options.poolType === 'countdown';
	}
}

declare namespace CountDownPool {
	interface Options extends BasePoolTerm.Options {}
}

export { CountDownPool };
