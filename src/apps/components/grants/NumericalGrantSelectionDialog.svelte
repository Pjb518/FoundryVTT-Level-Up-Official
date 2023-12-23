<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";

    export let { dialog, heading, base, choices, configObject, count, bonus } =
        // @ts-ignore
        getContext("#external").application;

    function onSubmit() {
        dialog.submit({
            selected,
        });
    }

    let selected = [...base];
</script>

<article>
    <FormSection
        {heading}
        warning="{count - selected.length} choice(s) remaining."
        showWarning={selected.length < count}
        hint="A5E.originSheets.optionalSelectionHint"
        --direction="column"
    >
        <CheckboxGroup
            options={Object.entries(configObject)}
            {selected}
            orange={choices}
            disabled={selected.length >= count}
            on:updateSelection={({ detail }) => (selected = detail)}
        />
    </FormSection>

    <FormSection>
        This grant provides a bonus of {bonus} to {selected
            .map((s) => configObject[s])
            .join(", ")}.
    </FormSection>

    <button on:click|preventDefault={onSubmit}> Submit </button>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }
</style>
