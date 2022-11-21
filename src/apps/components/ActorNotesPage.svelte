<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
	import { getContext } from 'svelte';
	import { TJSProseMirror } from '@typhonjs-fvtt/svelte-standard/component';

	import updateDocumentDataFromField from '../utils/updateDocumentDataFromField';

	const actor = getContext('actor');

	function updateDescription(event) {
		const { content } = event.detail;

		$actor.update({
			'system.details.notes': content === '<p></p>' ? '' : content,
		});
	}

	$: details = $actor.system.details;
</script>

<div class="editor">
	<!-- svelte-ignore missing-declaration -->
	<TJSProseMirror
		content={$actor.system.details.notes || localize('A5E.NoDescription')}
		enrichedContent={TextEditor.enrichHTML($actor.system.details.notes, {
			async: false,
		})}
		on:editor:save={event => updateDescription(event)}
	/>
</div>

<style lang="scss">
	.editor {
		height: 100%;

		// Nudges the edit icon down 1px. Removing this hides the top border for the button.
		--tjs-editor-edit-top: 1px;
	}
</style>
