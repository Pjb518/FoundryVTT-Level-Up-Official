<script>
    import { createEventDispatcher } from "svelte";

    import prepareTraitGrantConfigObject from "../../../utils/prepareTraitGrantConfigObject";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    export let grant;
    export let base;
    export let choices;
    export let count;
    export let traitType;

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

    function getGrantSummary(selected) {
        // return ` This grant provides a bonus of ${bonus} to ${selected
        //     .map((s) => configObject[s])
        //     .join(", ")}.`;
        return "";
    }

    function onUpdateSelection({ detail }) {
        selected = detail;
        dispatch("updateSelection", { selected, summary });
    }

    const dispatch = createEventDispatcher();
    const configObject = prepareTraitGrantConfigObject();
    let choicesLocked = true;

    $: selected = [...base];
    $: remainingSelections = count - selected.length;
    $: disabledOptions = getDisabledOptions(choicesLocked, grant);
    $: summary = getGrantSummary(selected);
</script>

<Section
    heading="Trait Grant - {grant.label}"
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
        warning={remainingSelections === 1
            ? `1 choice remaining`
            : `${count - selected.length} choices remaining.`}
        showWarning={selected.length < count}
        --direction="column"
    >
        <CheckboxGroup
            options={configObject[traitType]?.config}
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
