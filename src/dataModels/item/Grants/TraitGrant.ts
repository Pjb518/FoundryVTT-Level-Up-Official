import BaseGrant from './BaseGrant';

import TraitGrantConfig from '../../../apps/components/grants/TraitGrantConfig.svelte';
import TraitGrantSelectionDialog from '../../../apps/components/grants/TraitGrantSelectionDialog.svelte';

import prepareTraitGrantConfigObject from '../../../utils/prepareTraitGrantConfigObject';

export default class TraitGrant extends BaseGrant {
  #component = TraitGrantSelectionDialog;

  #configComponent = TraitGrantConfig;

  #type = 'trait';

  static override defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'trait' }),
      traits: new fields.SchemaField({
        base: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        options: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new fields.NumberField({ required: true, initial: 0, integer: true }),
        traitType: new fields.StringField({ required: true, initial: 'conditionImmunities' })
      }),
      label: new fields.StringField({ required: true, initial: 'New Trait Grant' })
    });
  }

  override getApplyData(actor: any, data: any) {
    if (!actor) return {};
    const selected: string[] = data?.selected ?? this.traits.base ?? [];
    const count: number = this.traits.total;

    // Construct grant
    const grantData = {
      traitData: {
        traits: selected,
        total: count,
        traitType: this.traits.traitType
      },
      itemUuid: this.parent.uuid,
      grantId: this._id,
      grantType: this.#type,
      level: this.level
    };

    // Construct trait update
    const configObject = prepareTraitGrantConfigObject();
    const { propertyKey } = configObject[this.traits.traitType] ?? {};
    if (!propertyKey) return {};
    if (!selected.length) return {};

    let traits: Set<string>;

    if (this.traits.traitType === 'size') {
      traits = new Set([selected[0]]);
    } else {
      traits = new Set([
        ...selected,
        ...(foundry.utils.getProperty(actor, propertyKey) as string[] ?? [])
      ]);
    }

    return {
      [propertyKey]: [...traits],
      'system.grants': {
        ...actor.system.grants,
        [this._id]: grantData
      }
    };
  }

  override getSelectionComponent() {
    return this.#component;
  }

  override getSelectionComponentProps(data: any) {
    return {
      base: this.traits.base ?? [],
      choices: this.traits.options,
      count: this.traits.total,
      traitType: this.traits.traitType,
      selected: data?.selected ?? []
    };
  }

  override requiresConfig(): boolean {
    return this.traits.options.length;
  }

  override async configureGrant() {
    const dialogData = {
      document: this.parent,
      grantId: this._id
    };

    super.configureGrant(
      'Configure Trait Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
