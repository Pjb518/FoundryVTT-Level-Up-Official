<script lang="ts">
	import type { PartySheetA5E } from '#documents/sheets/PartySheet.svelte.ts';
	import updateDocumentDataFromField from '#utils/updateDocumentDataFromField.ts';
	import { editDocumentImage } from '#utils/view/editDocumentImage.ts';

	type Props = {
		party: Actor.OfType<'party'>;
		sheet: PartySheetA5E;
	};

	function onEditImage(event) {
		editDocumentImage(party, { shiftKey: event.shiftKey });
	}

	let { party, sheet }: Props = $props();

	let partyData = $derived(party.reactive.system);
	let members = $derived(partyData.details.members);
</script>

<main>
	<header class="a5e-party__header">
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<img
			class="a5e-party__header__img"
			src={party.reactive.img}
			alt={party.reactive.name}
			onclick={onEditImage}
		>

		<div>
			<input
				class="a5e-input a5e-input--character-name"
				type="text"
				value={party.reactive.name}
				spellcheck="false"
				autocomplete="off"
				onchange={({ currentTarget}) => updateDocumentDataFromField(party, "name", currentTarget.value)}
			>
		</div>

		<div class="a5e-party__header__level">
			{partyData.details.level ?? 1}
		</div>
	</header>

	<hr class="a5e-party__seperator">

	<!-- Start Main Section Here -->
	<section class="a5e-party__core">
		{#if members.length > 0}
		{:else}
			<div class="a5e-party__instructions">
				Drop actors into this window to populate the party.
			</div>
		{/if}
	</section>

	<!-- Footer Goes Here -->
</main>

<style lang="scss">
    .a5e-party {
        &__header {
            display: grid;
            grid-template-columns: 5rem 1fr 5rem;

            &__img {
                width: 4rem;
                aspect-ratio: 1/ 1;
            }

            &__level {
                font-size: 1.75rem;
            }
        }

        &__instructions {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 5rem;
            padding: 1rem;
            margin: 1rem;
            font-size: var(--a5e-md-text);
            border: 2px dashed var(--a5e-border-color);
            border-radius: var(--a5e-border-radius-standard);
        }

        &__seperator {
            margin-block: 1rem;
        }
    }
</style>
