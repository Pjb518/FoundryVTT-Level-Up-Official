import type { FixedInstanceType, Mixin } from 'fvtt-types/utils';
import * as svelte from 'svelte';

import ApplicationV2 = foundry.applications.api.ApplicationV2;

interface SvelteApplicationRenderContext {
	/** State data tracked by the root component: objects herein must be plain object. */
	state: object;
	/** This application instance */
	foundryApp: SvelteApplication;
}

/** ---------------------------------------- */
//  Main
/** ---------------------------------------- */
function SvelteApplicationMixin<BaseClass extends SvelteApplicationMixin.BaseClass>(
	BaseApplication: BaseClass,
) {
	abstract class SvelteApplication extends BaseApplication {
		// @ts-expect-error
		static override DEFAULT_OPTIONS = {
			classes: ['a5e'],
		};

		protected abstract root: svelte.Component<any>;

		protected $state = $state({});

		/** The mounted root component, saved to be unmounted on application close */
		#mount: object = {};

		/** Get the content element of the application window */
		get windowContent() {
			return this.hasFrame ? this.element.querySelector('.window-content') : this.element;
		}

		protected abstract override _prepareContext(
			options: ApplicationV2.RenderOptions & { isFirstRender: boolean },
		): Promise<ApplicationV2.RenderContext>;

		protected override async _renderHTML(context: ApplicationV2.RenderContext) {
			return context;
		}

		protected override _replaceHTML(
			result: SvelteApplicationRenderContext,
			content: HTMLElement,
			options: any,
		) {
			Object.assign(this.$state, result.state ?? {});

			if (options.isFirstRender) {
				this.#mount = svelte.mount(this.root, {
					target: content,
					props: { ...result, state: this.$state },
				});
			}
		}

		protected override _onClose(options: any) {
			super._onClose(options);

			svelte.unmount(this.#mount, { outro: true });
		}
	}

	return SvelteApplication;
}

declare namespace SvelteApplicationMixin {
	interface AnyMixedConstructor extends ReturnType<typeof SvelteApplicationMixin<BaseClass>> {}
	interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

	type BaseClass = new (...args: any[]) => ApplicationV2.Any;
	/* 	type Mix<BaseClass extends SvelteApplicationMixin.BaseClass> = Mixin<
		SvelteApplication,
		BaseClass
	>;
 */
	interface PartState {
		scrollPositions: Array<[el1: HTMLElement, scrollTop: number, scrollLeft: number]>;
		focus?: string | undefined;
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	type RenderContext = {};

	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	type Configuration = {};

	interface RenderOptions {
		parts: string[];
	}
}

type SvelteApplication = InstanceType<ReturnType<typeof SvelteApplicationMixin>>;

export { SvelteApplicationMixin, type SvelteApplicationRenderContext };
