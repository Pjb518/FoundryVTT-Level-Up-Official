<script lang="ts">
    import type { SkillSpecialtyGrant } from "#types/itemGrants.d.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        grant: SkillSpecialtyGrant;
        base: string[];
        choices: string[];
        count: number;
        skill: string;
        selected: string[];
        updateSelectionFunc?: (value: any) => void;
    };

    function getGrantSummary(selected: string[]) {
        return "";
    }

    function onUpdateSelection(value: any) {
        selected = value;
        updateSelectionFunc?.({ selected, summary });
    }

    let {
        grant,
        base,
        choices,
        count,
        skill,
        selected: preSelected,
        updateSelectionFunc = undefined,
    }: Props = $props();

    const { skillSpecialties } = CONFIG.A5E;
    let choicesLocked = $state(true);

    let selected = $derived([...new Set(base.concat(preSelected))]);
    let totalCount = $derived(count + base.length);
    let remainingSelections = $derived(totalCount - selected.length);
    let summary = $derived(getGrantSummary(selected));
</script>

<Section
    heading="Skill Specialty Grant - {grant.label}"
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
            {onUpdateSelection}
        />
    </FieldWrapper>
</Section>
