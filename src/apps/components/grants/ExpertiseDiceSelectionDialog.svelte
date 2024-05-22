<script lang="ts">
    import type { ExpertiseDiceGrant } from "types/itemGrants";

    import { createEventDispatcher } from "svelte";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    export let grant: ExpertiseDiceGrant;
    export let base: string[];
    export let choices: string[];
    export let count: number;
    export let expertiseType: string;
    export let selected: string[];

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

    function getOptions(choicesLocked: boolean): string[][] {
        if (!choicesLocked) return configObject[expertiseType]?.options ?? [];

        const options: string[][] = [];
        for (const [value, label] of configObject[expertiseType]?.options ?? []) {
            if (choices.includes(value)) {
                options.push([value, label]);
            }
        }

        return options;
    }

    const dispatch = createEventDispatcher();
    const configObject = {
        abilityCheck: {
            label: "A5E.AbilityCheck",
            options: Object.entries(CONFIG.A5E.abilities),
        },
        abilitySave: {
            label: "A5E.SavingThrow",
            options: Object.entries(CONFIG.A5E.abilities),
        },
        attack: {
            label: "A5E.ActionOptionAttack",
            options: Object.entries(CONFIG.A5E.attackTypes),
        },
        initiative: {
            label: "A5E.Initiative",
            options: [],
        },
        skill: {
            label: "A5E.Skill",
            options: Object.entries(CONFIG.A5E.skills),
        },
    };

    let choicesLocked = true;

    $: selected = [...new Set(base.concat(selected))];
    $: totalCount = base.length + count;
    $: remainingSelections = totalCount - selected.length;
    $: summary = getGrantSummary(selected);
</script>

<Section
    heading="Expertise Dice Grant - {grant.label}"
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

<style lang="scss"></style>
