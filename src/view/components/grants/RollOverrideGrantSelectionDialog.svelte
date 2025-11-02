<script lang="ts">
    import type { ExpertiseDiceGrant } from "#types/itemGrants.d.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        grant: ExpertiseDiceGrant;
        base: string[];
        choices: string[];
        count: number;
        rollOverrideType: string;
        selected: string[];
        updateSelectionFunc?: (value: any) => void;
    };

    function getGrantSummary(selected) {
        // return ` This grant provides a bonus of ${bonus} to ${selected
        //     .map((s) => configObject[s])
        //     .join(", ")}.`;
        return "";
    }

    function onUpdateSelection(value: any) {
        selected = value;
        updateSelectionFunc?.({ selected, summary });
    }

    function getOptions(choicesLocked: boolean): string[][] {
        if (!choicesLocked) return configObject[rollOverrideType]?.options ?? [];

        const options: string[][] = [];
        for (const [value, label] of configObject[rollOverrideType]?.options ?? []) {
            if (choices.includes(value)) {
                options.push([value, label]);
            }
        }

        return options;
    }

    let {
        grant,
        base,
        choices,
        count,
        rollOverrideType,
        selected: preSelected,
        updateSelectionFunc = undefined,
    }: Props = $props();

    const configObject = {
        abilityCheck: {
            label: "A5E.abilities.headings.check",
            options: Object.entries(CONFIG.A5E.abilities),
        },
        abilitySave: {
            label: "A5E.rollLabels.savingThrows.title",
            options: Object.entries(CONFIG.A5E.abilities),
        },
        attack: {
            label: "A5E.actions.headings.options.attack",
            options: Object.entries(CONFIG.A5E.attackTypes),
        },
        initiative: {
            label: "A5E.initiative.title",
            options: [],
        },
        concentration: {
            label: "A5E.SpellConcentration",
            options: [],
        },
        deathSave: {
            label: "Death Save",
            options: [],
        },
        skill: {
            label: "A5E.skillLabels.title",
            options: Object.entries(CONFIG.A5E.skills),
        },
    };

    let choicesLocked = $state(true);

    let selected = $derived([...new Set(base.concat(preSelected))]);
    let totalCount = $derived(base.length + count);
    let remainingSelections = $derived(totalCount - selected.length);
    let summary = $derived(getGrantSummary(selected));
</script>

<Section
    heading="Roll Override Grant - {grant.label}"
    headerButtons={[
        {
            classes: "add-button",
            handler: () => (choicesLocked = !choicesLocked),
            htmlString: `<i class="icon fa-solid ${
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
            {onUpdateSelection}
        />
    </FieldWrapper>

    <FieldWrapper>
        {summary}
    </FieldWrapper>
</Section>

<style lang="scss"></style>
