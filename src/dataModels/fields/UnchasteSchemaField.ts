/** A `SchemaField` that does not cast the source value to an object */
export default class UnchasteSchemaField extends foundry.data.fields.SchemaField {
  // @ts-ignore
  protected override _cast(value: unknown): any {
    return value as any;
  }

  // @ts-ignore
  protected override _cleanType(
    value: object,
    options?: any
  ): any {
    if (typeof value !== 'object') {
      return value;
    }

    return super._cleanType(value, options);
  }
}
