import terms = foundry.dice.terms;

class BasePoolTerm extends terms.PoolTerm {
	declare options: BasePoolTerm.Options;

	get type() {
		return this.options.type || 'default';
	}
}

declare namespace BasePoolTerm {
	interface Options extends terms.RollTerm.Options {
		type?: string;
	}
}

export { BasePoolTerm };
