import A5EDataModel from '../../A5EDataModel';
import GenericDialog from '../../../apps/dialogs/initializers/GenericDialog';

export default class BaseGrant extends A5EDataModel {
  #component = null;

  constructor(data: any, options: any = {}) {
    // @ts-ignore
    super(data, options);
  }

  static defineSchema() {
    const { fields } = foundry.data;

    return {
      _id: new fields.DocumentIdField({ initial: () => foundry.utils.randomID() }),
      default: new fields.BooleanField({ required: true, initial: true }),
      img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' }),
      grantType: new fields.StringField({ required: true, initial: '' }),
      label: new fields.StringField({ required: true, initial: '' }),
      optional: new fields.BooleanField({ required: true, initial: false })
    };
  }

  async applyGrant(title: string, data: any, component: any, options: any = {}): Promise<any> {
    // Open Dialog and get choices
    const dialog = new GenericDialog(
      title,
      component,
      data,
      options
    );

    await dialog.render(true);
    const promise = await dialog.promise;

    if (!promise) return {};
    return promise;
  }

  async configureGrant(title: string, data: any, component: any, options: any = {}): Promise<any> {
    const dialog = new GenericDialog(
      title,
      component,
      data,
      options
    );

    await dialog.render(true);
    const promise = await dialog.promise;

    if (!promise) return {};
    return promise;
  }
}
