import SystemSettings from './SystemSettings';

// @ts-ignore
export default class SettingsShim extends FormApplication {
  constructor() {
    super({});
    SystemSettings.show();
  }

  /** @override */
  async updateObject() {
    //
  }

  render() {
    // @ts-ignore
    this.close();
  }
}
