import BaseGrant from './BaseGrant';

export default class ExpertiseDiceGrant extends BaseGrant {
  #component = null;

  #configComponent = null;

  #type = 'expertiseDice';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'expertiseDice' })

    });
  }

  override async applyGrant(actor: typeof Actor): Promise<void> {
    if (!actor) return;
  }

  override async configureGrant() {
    const dialogData = {
      document: this.parent,
      grantId: this._id,
      grantType: this.#type
    };

    super.configureGrant(
      'Configure Expertise Dice Grant',
      dialogData,
      this.#configComponent,
      { width: 500 }
    );
  }
}
