import SystemSettings from './SystemSettings';

export default class SettingsShim extends FormApplication {
  constructor() {
    super({});
    SystemSettings.show();
  }

  /** @override */
  async updateObject(): void {
    //
  }

  render(): void {
    this.close();
  }
}
