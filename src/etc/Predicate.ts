/** --------------------------------------*/
// Predicate Class
/** --------------------------------------*/

/** Logic to determine if a given document applies given some predicates */
class Predicate extends Array<Statement> {
	/** Is the predicate valid */
	readonly isValid: boolean;

	constructor(...statements: Statement[] | [Statement[]]) {
		super(...(Array.isArray(statements[0]) ? statements[0] : (statements as Statement[])));
		this.isValid = Predicate.isValid(this);

		Object.defineProperty(this, 'isValid', { enumerable: false });
	}

	/** Test is this predicate is true for the given tags */
	test(tags: string[] | Set<string>): boolean {
		if (this.length === 0) return true;
		else if (!this.isValid) {
			console.warn('A5E | The provided predicate set is malformed.');
			return false;
		}

		const domain = tags instanceof Set ? tags : new Set(tags);
		return this.every((s) => this.#isTrue(s, domain));
	}

	/** Check if the provided statement is true */
	#isTrue(statement: Statement, domain: Set<string>): boolean {
		return (
			(typeof statement === 'string' && domain.has(statement)) ||
			(StatementValidator.isBinary(statement) && this.#testBinary(statement, domain)) ||
			(StatementValidator.isCompound(statement) && this.#testCompound(statement, domain))
		);
	}

	/** Check if provided binary statement is true */
	#testBinary(statement: BinaryOperation, domain: Set<string>): boolean {
		if ('eq' in statement) {
			return typeof statement.eq[1] === 'string'
				? statement.eq[0] === statement.eq[1]
				: domain.has(`${statement.eq[0]}:${statement.eq[1]}`);
		}

		const [op, [left, right]] = Object.entries(statement ?? {})[0];
		const getValues = (operand: string | number): number[] => {
			const maybeNumber = Number(operand);
			if (!Number.isNaN(maybeNumber)) return [maybeNumber];

			const pattern = new RegExp(`^${operand}:([^:]+)$`);
			const values = domain
				.values()
				// @ts-expect-error
				.map((s) => Number(pattern.exec(s)?.[1] || NaN))
				.filter((v) => !Number.isNaN(v))
				.toArray();

			return values.length > 0 ? values : [NaN];
		};

		const leftValues = getValues(left);
		const rightValues = getValues(right);

		switch (op) {
			case 'gt':
				return leftValues.some((l) => rightValues.every((r) => l > r));
			case 'gte':
				return leftValues.some((l) => rightValues.every((r) => l >= r));
			case 'lt':
				return leftValues.some((l) => rightValues.every((r) => l < r));
			case 'lte':
				return leftValues.some((l) => rightValues.every((r) => l <= r));
			default:
				console.warn('A5E | Malformed binary operation encountered');
				return false;
		}
	}

	/** Check if provided compound statement is true */
	#testCompound(statement: CompoundStatement, domain: Set<string>): boolean {
		return (
			('and' in statement && statement.and.every((s) => this.#isTrue(s, domain))) ||
			('nand' in statement && !statement.nand.every((s) => this.#isTrue(s, domain))) ||
			('or' in statement && statement.or.some((s) => this.#isTrue(s, domain))) ||
			('xor' in statement && statement.xor.filter((s) => this.#isTrue(s, domain)).length === 1) ||
			('nor' in statement && !statement.nor.some((s) => this.#isTrue(s, domain))) ||
			('not' in statement && !this.#isTrue(statement.not, domain)) ||
			('if' in statement &&
				!(this.#isTrue(statement.if, domain) && !this.#isTrue(statement.then, domain))) ||
			('iff' in statement &&
				(statement.iff.every((s) => this.#isTrue(s, domain)) ||
					statement.iff.every((s) => !this.#isTrue(s, domain))))
		);
	}

	/** Create a clone of this predicate */
	clone(): Predicate {
		return new Predicate(this.toObject());
	}

	/** Helper to make the predicate json serializable */
	toObject(): RawPredicate {
		return foundry.utils.deepClone([...this]);
	}

	/** Checks if a predicate is valid */
	static isValid(statements: unknown): statements is Statement[] {
		return this.isArray(statements);
	}

	/** Checks if this is an array of statements */
	static override isArray(statements: unknown): statements is Statement[] {
		return super.isArray(statements) && statements.every((s) => StatementValidator.isStatement(s));
	}

	/** Test if a predicate is true for the given tags */
	static test(predicate: Statement[] = [], tags: Set<string> | string[]): boolean {
		return predicate instanceof Predicate
			? predicate.test(tags)
			: new Predicate(...predicate).test(tags);
	}
}

/** --------------------------------------*/
// Validator Class
/** --------------------------------------*/

/** Validates a provided statement */
// biome-ignore lint/complexity/noStaticOnlyClass: <>
class StatementValidator {
	/** Checks if the provided statement is a valid statement */
	static isStatement(statement: unknown): statement is Statement {
		return foundry.utils.isPlainObject(statement)
			? this.isCompound(statement) || this.isBinary(statement)
			: typeof statement === 'string'
				? this.isAtomic(statement)
				: false;
	}

	/** Checks if the statement is atomic */
	static isAtomic(statement: unknown): statement is Atom {
		return (typeof statement === 'string' && statement.length > 0) || this.isBinary(statement);
	}

	static #binaryOperators = new Set(['eq', 'gt', 'gte', 'lt', 'lte']);

	/** Checks if the statement is binary */
	static isBinary(statement: unknown): statement is BinaryOperation {
		if (!foundry.utils.isPlainObject(statement)) return false;

		const entries = Object.entries(statement ?? {});
		if (entries.length > 1) return false;

		const [op, ops]: [string, unknown] = entries[0];

		return (
			this.#binaryOperators.has(op) &&
			Array.isArray(ops) &&
			ops.length === 2 &&
			typeof ops[0] === 'string' &&
			['string', 'number'].includes(typeof ops[1])
		);
	}

	/** Checks if the statement is compound */
	static isCompound(statement: unknown): statement is CompoundStatement {
		return (
			foundry.utils.isPlainObject(statement) &&
			(this.isConjunction(statement) ||
				this.isDisjunction(statement) ||
				this.isExclusiveDisjunction(statement) ||
				this.isNegation(statement) ||
				this.isAlternativeDenial(statement) ||
				this.isJointDenial(statement) ||
				this.isConditional(statement) ||
				this.isBiConditional(statement))
		);
	}

	/** Checks if the statement is conjunction */
	static isConjunction(statement: { and?: unknown }): statement is Conjunction {
		return (
			Object.keys(statement).length === 1 &&
			Array.isArray(statement.and) &&
			statement.and.every((s) => this.isStatement(s))
		);
	}

	/** Checks if the statement is disjunction */
	static isDisjunction(statement: { or?: unknown }): statement is Disjunction {
		return (
			Object.keys(statement).length === 1 &&
			Array.isArray(statement.or) &&
			statement.or.every((s) => this.isStatement(s))
		);
	}

	/** Checks if the statement is exclusive disjunction */
	static isExclusiveDisjunction(statement: { xor?: unknown }): statement is ExclusiveDisjunction {
		return (
			Object.keys(statement).length === 1 &&
			Array.isArray(statement.xor) &&
			statement.xor.every((s) => this.isStatement(s))
		);
	}

	/** Checks if the statement is negation */
	static isNegation(statement: { not?: unknown }): statement is Negation {
		return (
			Object.keys(statement).length === 1 && !!statement.not && this.isStatement(statement.not)
		);
	}

	/** Checks if the statement is Alternative denial */
	static isAlternativeDenial(statement: { nand?: unknown }): statement is AlternativeDenial {
		return (
			Object.keys(statement).length === 1 &&
			Array.isArray(statement.nand) &&
			statement.nand.every((s) => this.isStatement(s))
		);
	}

	/** Checks if the statement is Joint Denial */
	static isJointDenial(statement: { nor?: unknown }): statement is JointDenial {
		return (
			Object.keys(statement).length === 1 &&
			Array.isArray(statement.nor) &&
			statement.nor.every((s) => this.isStatement(s))
		);
	}

	/** Checks if the statement is conditional */
	static isConditional(statement: { if?: unknown; then?: unknown }): statement is Conditional {
		return (
			Object.keys(statement).length === 2 &&
			this.isStatement(statement.if) &&
			this.isStatement(statement.then)
		);
	}

	/** Checks if the statement is bi-conditional */
	static isBiConditional(statement: { iff?: unknown }): statement is BiConditional {
		return (
			Object.keys(statement).length === 1 &&
			Array.isArray(statement.iff) &&
			statement.iff.every((s) => this.isStatement(s))
		);
	}
}

/** --------------------------------------*/
// Types
/** --------------------------------------*/

type EqualTo = { eq: [string, string | number] };
type GreaterThan = { gt: [string, string | number] };
type GreaterThanOrEqualTo = { gte: [string, string | number] };
type LessThan = { lt: [string, string | number] };
type LessThanOrEqualTo = { lte: [string, string | number] };

type BinaryOperation = EqualTo | GreaterThan | GreaterThanOrEqualTo | LessThan | LessThanOrEqualTo;
type Atom = BinaryOperation | string;

type Conjunction = { and: Statement[] };
type Disjunction = { or: Statement[] };
type ExclusiveDisjunction = { xor: Statement[] };
type Negation = { not: Statement };
type AlternativeDenial = { nand: Statement[] };
type JointDenial = { nor: Statement[] };

type Conditional = { if: Statement; then: Statement };
type BiConditional = { iff: Statement[] };

type CompoundStatement =
	| Conjunction
	| Disjunction
	| ExclusiveDisjunction
	| Negation
	| AlternativeDenial
	| JointDenial
	| Conditional
	| BiConditional;

type Statement = Atom | CompoundStatement;

type RawPredicate = Statement[];

export type { RawPredicate, Statement };
export { Predicate, StatementValidator };
