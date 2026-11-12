import { A5E } from '../../config.ts';

export type RawCurrency = {
	pp?: number;
	gp?: number;
	ep?: number;
	sp?: number;
	cp?: number;
	cr?: number;
};

class Currency implements RawCurrency {
	declare cp: number;
	declare sp: number;
	declare ep: number;
	declare gp: number;
	declare pp: number;
	declare cr: number;

	#givenUnit: CurrencyDenomination | null;

	constructor(data: Partial<Record<CurrencyDenomination, number>> | number | null) {
		// @ts-expect-error
		this.#givenUnit = foundry.utils.getType(data) === 'Object' ? Object.keys(data ?? {})[0] : null;

		const object = typeof data === 'number' ? { cp: data } : (data ?? {});

		for (const denom of CURRENCY_DENOMINATIONS) {
			this[denom] = Math.max(Math.floor(Math.abs(object[denom] ?? 0)), 0);
		}
	}

	/** The total value of this currency in copper */
	get copperValue(): number {
		return CURRENCY_DENOMINATIONS.reduce(
			(acc, v) => acc + this[v] * CONFIG.A5E.denominationRates[v],
			0,
		);
	}

	/** The total value of this currency in gold */
	get goldValue(): number {
		return this.copperValue / 100;
	}

	/** Add 2 currencies together */
	plus(currency: Partial<Record<CurrencyDenomination, number>>): Currency {
		const other = new Currency(currency);
		const result = {} as Record<CurrencyDenomination, number>;

		for (const type of CURRENCY_DENOMINATIONS) {
			result[type] = this[type] + other[type];
		}

		return new Currency(result);
	}

	/** Multiply currency by a number */
	scale(factor: number): Currency {
		const result = new Currency(this);

		for (const type of CURRENCY_DENOMINATIONS) {
			result[type] *= factor;
		}

		// If the factor is not a whole number, we will need to handle coin spillover
		if (factor % 1 !== 0) {
			result.gp += (result.pp % 1) * 10;
			result.sp += (result.gp % 1) * 10;
			result.cp += (result.sp % 1) * 10;

			// Some computations like 2.8 % 1 evaluate to 0.79999, so we can't just floor
			for (const denom of CURRENCY_DENOMINATIONS) {
				result[denom] = Math.floor(Number(result[denom].toFixed(1)));
			}
		}

		return result;
	}

	/** For Serialization */
	toObject(): RawCurrency {
		const result: RawCurrency = {};

		for (const denom of CURRENCY_DENOMINATIONS) {
			result[denom] = this[denom];
		}

		return result;
	}

	/** Creates a new price string such as "5 gp" from this object */
	toString({
		short = false,
		unit = 'primary',
		decimal = false,
	}: CurrencyStringParams = {}): string {
		const normalize = unit === 'primary';

		// Handle credits and decimals
		if (unit === 'cr') {
			const value = Math.ceil(this.goldValue);
			return short ? String(value) : `${value} Credits`;
			// @ts-expect-error
		} else if ((unit === 'primary' && decimal) || CURRENCY_DENOMINATIONS.includes(unit)) {
			const denom = unit === 'primary' ? 'gp' : unit;
			const divider = CONFIG.A5E.denominationRates[denom];
			const value = this.copperValue / divider;
			const unitLabel = CONFIG.A5E.currencyDenominations[denom];
			return `${decimal ? value.toFixed(1) : value} ${unitLabel}`;
		}

		const currency = normalize ? this.normalized() : this;

		// Return 0 in the default denomination if there's nothing
		if (CURRENCY_DENOMINATIONS.every((denom) => !currency[denom])) {
			const zeroUnit = (unit === 'raw' ? this.#givenUnit : null) ?? 'gp';
			return `0 ${CONFIG.A5E.currencyDenominations[zeroUnit]}`;
		}

		// Display all denominations from biggest to smallest
		const parts: string[] = [];
		for (const denom of CURRENCY_DENOMINATIONS) {
			const value = currency[denom];
			const unitLabel = CONFIG.A5E.currencyDenominations[denom];
			if (value) parts.push(`${value} ${unitLabel}`);
		}

		return parts.join(', ');
	}

	/** Returns the coins normalized to the system currency */
	normalized(): Currency {
		const currency = new Currency({
			cp: this.copperValue,
		});

		currency.sp = Math.floor(currency.cp / 10);
		currency.cp = currency.cp % 10;
		currency.gp = Math.floor(currency.sp / 10);
		currency.sp = currency.sp % 10;

		return currency;
	}
}

type CurrencyDenomination = keyof typeof CONFIG.A5E.currencyDenominations;

const CURRENCY_DENOMINATIONS = Object.keys(
	A5E.currencyDenominations,
) as unknown as CurrencyDenomination[];

interface CurrencyStringParams {
	/** If true, indicates that space is limited. This omits displaying "credits" in sf2e */
	short?: boolean;
	/**
	 * Shows the value in a specific unit, or a special type. The special types are:
	 * - raw: shows the exact contained values without conversion
	 * - primary: normalizes to gp in pf2e or credits in sf2e.
	 *   If decimals is false, then 5 sp will be shown as 5 sp, but 50 sp will be shown as 5 gp.
	 */
	unit?: CurrencyDenomination | 'primary' | 'raw';
	/** If enabled, the result is shown with decimals regardless of value, unless its credits */
	decimal?: boolean;
}

export { CURRENCY_DENOMINATIONS, Currency };
