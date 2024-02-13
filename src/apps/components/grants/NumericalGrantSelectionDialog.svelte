<script lang="ts">
    import type { ItemGrant } from "types/itemGrants";

    import { createEventDispatcher } from "svelte";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    export let grant: ItemGrant;
    export let heading: string;
    export let base: string[];
    export let choices: string[];
    export let configObject: Record<string, any> = {};
    export let count: number;
    export let bonus: string;

    function getGrantSummary(bonus: string, selected: string[]) {
        return ` This grant provides a bonus of ${bonus} to ${selected
            .map((s) => configObject[s])
            .join(", ")}.`;
    }

    function onUpdateSelection({ detail }) {
        selected = detail;
        dispatch("updateSelection", { selected, summary });
    }

    function getOptions(choicesLocked: boolean): string[][] {
        if (!choicesLocked) return Object.entries(configObject);

        const options: string[][] = [];
        for (const [value, label] of Object.entries(configObject)) {
            if (choices.includes(value)) {
                options.push([value, label]);
            }
        }

        return options;
    }

    const dispatch = createEventDispatcher();
    let choicesLocked = true;

    $: totalCount = base.length + count;

    $: selected = [...base];
    $: remainingSelections = count - selected.length;
    $: summary = getGrantSummary(bonus, selected);
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
        warning={remainingSelections === 1
            ? `1 choice remaining`
            : `${totalCount - selected.length} choices remaining.`}
        showWarning={selected.length < totalCount}
        --direction="column"
    >
        <CheckboxGroup
            options={getOptions(choicesLocked)}
            {selected}
            orange={choices}
            disabled={selected.length >= totalCount}
            on:updateSelection={onUpdateSelection}
        />
    </FieldWrapper>

    <FieldWrapper>
        {summary}
    </FieldWrapper>
</Section>

<style lang="scss">
</style>
