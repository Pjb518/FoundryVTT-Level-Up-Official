import { createApp } from 'vue';

/**
 * Create an application window housing a Vue application, allowing for more elaborate user
 * interfaces.
 *
 * Vue applications are passed the application window when creating the component, allowing them to
 * reference the application id. This also gives them access to the base application methods and
 * the promise property. The promise property can be used to get data out of the Vue app.
 *
 * @param App                  A Vue application to render inside the application window.
 * @param {Object} data        An object containing basic application information and props for the
 *                             Vue application.
 * @param {string} data.title  The window title displayed in the dialog header.
 * @param {Object} data.props  Data to be provided to the Vue application.
 * @param {Object} options     Application rendering options, see :class:`Application`
 *
 * @implements {Application}
 */
export default class ReactiveDialog extends FormApplication {
  constructor(App, data, options) {
    super(data, options);

    this._disable_popout_module = true;

    this.app = App;
    this.data = data;
    this.object = data.props.actor;

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  /**
   * Define default rendering options for the dialog window.
   *
   * @returns {object}
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['a5e-dialog'],
      width: 416
    });
  }

  get template() {
    return 'systems/a5e/templates/sheet.html';
  }

  get title() {
    return this.data.title;
  }

  /**
   * @inheritdoc
   */
  async maximize() {
    await super.maximize();

    // Ensure that the application is rendered to an appropriate height after being maximized.
    document.getElementById(this.id).style.setProperty('height', 'fit-content');
  }

  /**
   * Close the application, un-register references to it within UI mappings, and resolve
   * this.promise.
   *
   * This method returns a Promise which resolves once the window closing animation concludes.
   *
   * @override
   * @return {Promise<void>}  A Promise which resolves once the application is closed.
   */
  close(options) {
    this.resolvePromise(null);
    return super.close(options);
  }

  /** @override */
  async render(force = false, options = {}) {
    if (this.component) {
      const states = Application.RENDER_STATES;
      if (this._state === states.RENDERING || this._state === states.RENDERED) return;
    }

    try {
      await this._render(force, options);
    } catch (err) {
      err.message = `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`;
      console.error(err.message);
      this._state = Application.RENDER_STATES.ERROR;
    }

    const componentWrapper = this.element.find('.a5e-js-component-wrapper')[0];

    this.component = createApp(this.app, { appWindow: this, ...this.data.props });
    this.component.mount(componentWrapper);
    this.activateListeners($(this.form));
  }

  resolvePromise(data) {
    if (this.resolve) {
      this.resolve(data);
    }
  }

  /**
   * Close the application, un-register references to it within UI mappings, and resolve
   * this.promise using the application data.
   *
   * The intention is for this method to be called within the Vue application, so that the app can
   * return data from the dialog.
   *
   * @param {Any} data         Any data provided by the Vue app when submit is called.
   * @returns {Promise<void>}  A Promise which resolves once the application is closed.
   */
  submit(data) {
    this.resolvePromise(data);
    return super.close();
  }

  async _onChangeInput(event) {
    super._onChangeInput(event);

    const data = this._getSubmitData();
    this._updateObject(event, data);
  }

  async _updateObject(event, formData) {
    return this.object?.id ? this.object.update(formData) : null;
  }
}
