import type { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import type { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store/fvtt/document';

type ActorSheetApplicationProps = {
  document: TJSDocument,
  sheet: SvelteApplication,
};
