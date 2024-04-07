import BaseItemData from './BaseItemData';
import Armor from './template/Armor';

export default class ObjectDataModel extends BaseItemData.mixin(Armor) {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      ammunitionProperties: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      ),
      armorCategory: new fields.StringField({ required: true, initial: '' }),
      armorProperties: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      ),
      attuned: new fields.BooleanField({ required: true, initial: false }),
      bulky: new fields.BooleanField({ required: true, initial: false }),
      breakerProperties: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      ),
      craftingComponents: new fields.StringField({ required: true, initial: '' }),
      containerId: new fields.StringField({ required: true, initial: '' }),
      damagedState: new fields.NumberField({
        required: true, initial: 0, integer: true, min: 0, max: 2
      }),
      defensiveProperties: new fields.StringField({ required: true, initial: '' }),
      equippedState: new fields.NumberField({
        required: true, initial: 0, integer: true, min: 0, max: 2
      }),
      flaws: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      ),
      // TODO: Remove this in favor of a greedy approach
      items: new fields.ObjectField({ required: true, initial: {} }),
      materialProperties: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      ),
      mounted: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      ),
      objectType: new fields.StringField({ required: true, initial: '' }),
      plotItem: new fields.BooleanField({ required: true, initial: false }),
      price: new fields.StringField({ required: true, initial: '' }),
      proficient: new fields.BooleanField({ required: true, initial: false }),
      quantity: new fields.NumberField({
        required: true, initial: 1, integer: true, min: 0
      }),
      rarity: new fields.StringField({ required: true, initial: 'mundane' }),
      requiresAttunement: new fields.BooleanField({ required: true, initial: false }),
      shieldCategory: new fields.StringField({ required: true, initial: '' }),
      shieldProperties: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      ),
      unidentified: new fields.BooleanField({ required: true, initial: false }),
      unidentifiedDescription: new fields.HTMLField({ required: true, initial: '' }),
      unidentifiedName: new fields.StringField({ required: true, initial: '' }),
      versatile: new fields.StringField({ required: true, initial: '' }),
      weaponProperties: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      ),
      weight: new fields.NumberField({
        required: true, initial: 0, min: 0, nullable: false
      })
    });
  }

  // Types: armor, ammunition, clothing, consumable, container, helm, jewelry,
  //  miscellaneous, shield, tool, weapon
}
