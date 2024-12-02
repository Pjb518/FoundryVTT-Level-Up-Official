import SystemSettings from './SystemSettings';

export default class SettingsShim extends FormApplication {
  constructor() {
    super({});
    SystemSettings.show();
  }

  async _updateObject(): Promise<void> {
    //
  }

  override render(): void {
    this.close();
  }
}
