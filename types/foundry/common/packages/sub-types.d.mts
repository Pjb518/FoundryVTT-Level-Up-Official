/**
 * @typedef {Record<string, Record<string, object>>} DocumentTypesConfiguration
 */
/**
 * A special [ObjectField]{@link ObjectField} available to packages which configures any additional Document subtypes
 * provided by the package.
 */
import { ObjectField } from '../data/fields.d.mts';

export default class AdditionalTypesField extends ObjectField {
  #private;
}
export type DocumentTypesConfiguration = Record<string, Record<string, object>>;
