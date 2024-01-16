<svelte:options accessors={true} />

<script>
    import { getContext, createEventDispatcher } from "svelte";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    export let grant;
    export let heading;
    export let base;
    export let choices;
    export let configObject;
    export let count;
    export let bonus;

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

    function onUpdateSelection({ detail }) {
        selected = detail;
        dispatch("updateSelection", { selected, summary });
    }

    const dispatch = createEventDispatcher();
    let choicesLocked = true;

    $: selected = [...base];
    $: disabledOptions = getDisabledOptions(choicesLocked, grant);
    $: summary = ` This grant provides a bonus of ${bonus} to ${selected
        .map((s) => configObject[s])
        .join(", ")}.
    `;
</script>

<Section
    heading="{heading} - {grant.label}"
    headerButtons={[
        {
            classes: "add-button",
            handler: () => (choicesLocked = !choicesLocked),
            htmlString: `<i class="fa-solid ${
                choicesLocked ? "fa-plus" : "fa-minus"
            }" />`,
            tooltip: choicesLocked
                ? "Locked to Grant Options"
                : "Free Selection Mode",
        },
    ]}
    --a5e-section-body-gap="0.75rem"
>
    <FieldWrapper
        warning="{count - selected.length} choice(s) remaining."
        showWarning={selected.length < count}
        hint="A5E.grants.choicesHint"
        --direction="column"
    >
        <CheckboxGroup
            options={Object.entries(configObject)}
            {selected}
            orange={choices}
            disabled={selected.length >= count}
            {disabledOptions}
            on:updateSelection={onUpdateSelection}
        />
    </FieldWrapper>

    <FieldWrapper>
        {summary}
    </FieldWrapper>
</Section>

<style lang="scss">
</style>
