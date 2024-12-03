<svelte:options accessors={true} />

<script lang="ts">
import { getContext } from 'svelte';

import RadioGroup from '../components/RadioGroup.svelte';
import FieldWrapper from '../components/FieldWrapper.svelte';

export let { dialog, packOptions, defaultSelection } =
	// @ts-ignore
	getContext('#external').application;

function onSubmit() {
	dialog.submit({ pack: selected });
}

const selections: string[][] = packOptions;
let selected = defaultSelection;
</script>

<article>
    <FieldWrapper hint="Select which compendium to access">
        <RadioGroup
            options={selections}
            {selected}
            on:updateSelection={({ detail }) => (selected = detail)}
        />
    </FieldWrapper>

    <button on:click|preventDefault={onSubmit}> Submit </button>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding: 0.75rem;
        gap: 1rem;
        background: var(--a5e-color-background-sheet);
    }
</style>
