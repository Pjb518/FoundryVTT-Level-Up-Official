import * as svelte from 'svelte';

interface SvelteApplicationRenderContext {
    /** State data tracked by the root component: objects herein must be plain object. */
    state: object;
    /** This application instance */
    foundryApp: SvelteApplication;
}

function SvelteApplicationMixin(Base) {
  abstract class SvelteApplication extends Base {
    static override DEFAULT_OPTIONS = {
      classes: ["a5e"]
    }

    protected abstract root: svelte.Component<any>;

    protected $state: object = $state({});

    #mount: object = {};

    protected override async _renderHTML(context: any) {
      return context;
    }

    protected override _replaceHTML(result: SvelteApplicationRenderContext, content: HTMLElement, options: any) {
      Object.assign(this.$state, result.state);
      if (options.isFirstRender) {
        this.#mount = svelte.mount(this.root, { target: content, props: { ...result, state: this.$state });

      }
    }

    protected override _onClose(options: any) {
      super._onClose(options);
      svelte.unmount(this.#mount);
    }
  }

  return SvelteApplication;
}

type SvelteApplication = InstanceType<ReturnType<typeof SvelteApplicationMixin>>;

export { SvelteApplicationMixin, type SvelteApplicationRenderContext };
