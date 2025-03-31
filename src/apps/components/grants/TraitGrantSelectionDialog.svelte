<script lang="ts">
    import type { TraitGrant } from "types/itemGrants";

    import { createEventDispatcher } from "svelte";

    import prepareTraitGrantConfigObject from "../../../utils/prepareTraitGrantConfigObject";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    export let grant: TraitGrant;
    export let base: string[];
    export let choices: string[];
    export let count: number;
    export let selected: string[];
    export let traitType: string;

    function getGrantSummary(selected: string[]) {
        // return ` This grant provides a bonus of ${bonus} to ${selected
        //     .map((s) => configObject[s])
        //     .join(", ")}.`;
        return "";
    }

    function onUpdateSelection({ detail }) {
        selected = detail;
        dispatch("updateSelection", { selected, summary });
    }

    function getOptions(choicesLocked: boolean): string[][] {
        const options: string[][] = [];
        const optionKeys: string[] =
            configObject[traitType]?.config.map(([key]) => key) ?? [];

        const extra = choices.filter((c) => !optionKeys.includes(c));

        const totalOptions = [
            ...(configObject[traitType]?.config ?? []),
            ...extra.map((e) => [e, e]),
        ];

        if (!choicesLocked) return totalOptions;

        for (const [value, label] of totalOptions) {
            if (choices.includes(value)) {
                options.push([value, label]);
            }
        }

        return options;
    }

    const dispatch = createEventDispatcher();
    const configObject = prepareTraitGrantConfigObject();
    let choicesLocked = true;

    $: selected = [...new Set(base.concat(selected))];
    $: totalCount = base.length + count;
    $: remainingSelections = totalCount - selected.length;
    $: summary = getGrantSummary(selected);
</script>

<Section
    heading="Trait Grant - {grant.label}"
    headerButtons={[
        {
            classes: "add-button",
            handler: () => (choicesLocked = !choicesLocked),
            htmlString: `<i class="icon fa-solid ${
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
            : `${remainingSelections} choices remaining.`}
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
