<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";

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

    function getDisabledOptions() {
        const options = [];

        if (choicesLocked) {
            options.push(
                ...Object.keys(configObject).filter(
                    (key) => !choices.includes(key) || base.includes(key),
                ),
            );
        }

        return options;
    }

    let selected = [...base];
    let choicesLocked = true;

    $: disabledOptions = getDisabledOptions(choicesLocked);
</script>

<article>
    <FormSection
        {heading}
        warning="{count - selected.length} choice(s) remaining."
        showWarning={selected.length < count}
        hint="A5E.grants.choicesHint"
        --direction="column"
    >
        <button
            class="choice-lock"
            data-tooltip={choicesLocked
                ? "Locked to Grant Options"
                : "Free Selection Mode"}
            data-tooltip-direction="LEFT"
            on:click={() => (choicesLocked = !choicesLocked)}
        >
            <i
                class="fa-solid"
                class:fa-lock={choicesLocked}
                class:fa-lock-open={!choicesLocked}
                class:locked={choicesLocked}
                class:unlocked={!choicesLocked}
            />
        </button>

        <CheckboxGroup
            options={Object.entries(configObject)}
            {selected}
            orange={choices}
            disabled={selected.length >= count}
            {disabledOptions}
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

    .choice-lock {
        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        right: 0.5rem;
        top: 0.5;

        font-size: $font-size-sm;
        background: transparent;
        width: max-content;
        border: 0;
        padding: 0;
        margin: 0;
        transition: $standard-transition;

        &:hover,
        &:focus {
            transform: scale(1.2);
            box-shadow: none;
        }
    }

    .locked {
        color: $color-secondary;
    }

    .unlocked {
        color: $color-primary;
    }
</style>
