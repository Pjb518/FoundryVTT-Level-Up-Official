<script lang="ts">
    import type { ItemGrant } from "#types/itemGrants.d.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        grant: ItemGrant;
        heading: string;
        base: string[];
        choices: string[];
        configObject?: Record<string, any>;
        count: number;
        bonus: string;
        selected: string[];
        updateSelectionFunc?: (value: any) => void;
    };

    function getGrantSummary(bonus: string, selected: string[]) {
        return ` This grant provides a bonus of ${bonus} to ${selected
            .map((s) => configObject[s])
            .join(", ")}.`;
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

    function onUpdateSelection(value: string[]) {
        selected = value;
        updateSelectionFunc?.({ selected, summary });
    }

    let {
        grant,
        heading,
        base,
        choices,
        configObject = {},
        count,
        bonus,
        selected: preSelected,
        updateSelectionFunc = undefined,
    }: Props = $props();

    let choicesLocked = $state(true);

    let totalCount = $derived(base.length + count);

    let selected = $derived([...new Set(base.concat(preSelected))]);
    let remainingSelections = $derived(totalCount - selected.length);
    let summary = $derived(getGrantSummary(bonus, selected));
</script>

<Section
    heading="{heading} - {grant.label}"
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
            {onUpdateSelection}
        />
    </FieldWrapper>

    <FieldWrapper>
        {summary}
    </FieldWrapper>
</Section>
