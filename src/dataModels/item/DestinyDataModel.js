import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';
export default class DestinyDataModel extends A5EDataModel.mixin(SchemaDataModel) {
    static defineSchema() {
        return this.mergeSchema(super.defineSchema(), {
            description: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
            sourceOfInspiration: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
            inspirationFeature: new foundry.data.fields.StringField({ nullable: false, initial: '' }),
            fulfillmentFeature: new foundry.data.fields.StringField({ nullable: false, initial: '' })
        });
    }
}
//# sourceMappingURL=DestinyDataModel.js.map