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
export default class ReactiveDialog extends Application {
  constructor(App, data, options) {
    super(data, options);

    this.app = App;
    this.data = data;
    this._disable_popout_module = true;
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
      classes: ['a5e-dialog']
    });
  }

  /**
   * After rendering, create and mount the Vue application. Set the height property for the
   * application window to "fit-content" to allow for apps with varying and variable size.
   *
   * @override
   */
  activateListeners() {
    this.appInstance = createApp(this.app, { appWindow: this, ...this.data.props });
    this.appInstance.mount(`#${this.id} .window-content`);
    document.getElementById(this.id).style.setProperty('height', 'fit-content');
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

  /**
   * A dummy method to satisfy Foundry's Application class. It returns an empty string as the
   * actual inner content is mounted in the activateListeners method.
   *
   * @override
   * @returns {string} An empty string to satisfy Foundry's Application logic.
   */
  async _renderInner() {
    return '';
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
}
