<script lang="ts">
    import type { SkillSpecialtyGrant } from "types/itemGrants";

    import { createEventDispatcher } from "svelte";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    export let grant: SkillSpecialtyGrant;
    export let base: string[];
    export let choices: string[];
    export let count: number;
    export let skill: string;
    export let selected: string[];

    function getGrantSummary(selected: string[]) {
        return "";
    }

    function onUpdateSelection({ detail }) {
        selected = detail;
        dispatch("updateSelection", { selected, summary });
    }

    const dispatch = createEventDispatcher();
    const { skillSpecialties } = CONFIG.A5E;
    let choicesLocked = true;

    $: selected = [...new Set(base.concat(selected))];
    $: totalCount = count + base.length;
    $: remainingSelections = totalCount - selected.length;
    $: summary = getGrantSummary(selected);
</script>

<Section
    heading="Skill Specialty Grant - {grant.label}"
    headerButtons={[
        {
            classes: "add-button",
            handler: () => (choicesLocked = !choicesLocked),
            htmlString: `<i class="fa-solid ${
                choicesLocked ? "fa-plus" : "fa-minus"
            }" />`,
            tooltip: choicesLocked ? "Locked to Grant Options" : "Free Selection Mode",
        },
    ]}
>
    <FieldWrapper
        warning={remainingSelections === 1
            ? `1 choice remaining`
            : `${remainingSelections} choices remaining.`}
        showWarning={selected.length < totalCount}
    >
        <CheckboxGroup
            options={Object.entries(skillSpecialties[skill])}
            {selected}
            orange={choices}
            disabled={selected.length >= totalCount}
            on:updateSelection={onUpdateSelection}
        />
    </FieldWrapper>
</Section>
