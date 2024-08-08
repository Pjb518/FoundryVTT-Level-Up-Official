import SystemSettings from './SystemSettings';

export default class SettingsShim extends FormApplication {
  constructor() {
    super({});
    SystemSettings.show();
  }

  async updateObject(): void {
    //
  }

  override render(): void {
    this.close();
  }
}
