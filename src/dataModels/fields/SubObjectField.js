export default class SubObjectField extends foundry.abstract.DataModel {
    static defineSchema() {
        const { fields } = foundry.data;
        return {
            isValid: new fields.BooleanField({ initial: true }),
            isOptional: new fields.BooleanField({ initial: false }),
            quantityOverride: new fields.NumberField({ initial: 0, integer: true, min: 0 }),
            sourceUuid: new fields.StringField({ initial: '' }),
            uuid: new fields.StringField({ required: true, initial: '' })
        };
    }
}
//# sourceMappingURL=SubObjectField.js.map