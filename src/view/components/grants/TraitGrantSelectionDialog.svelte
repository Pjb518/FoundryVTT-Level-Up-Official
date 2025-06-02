<script lang="ts">
    import type { TraitGrant } from "types/itemGrants.d.ts";

    import prepareTraitGrantConfigObject from "#utils/prepareTraitGrantConfigObject.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        grant: TraitGrant;
        base: string[];
        choices: string[];
        count: number;
        selected: string[];
        traitType: string;
        updateSelectionFunc?: (value: any) => void;
    };

    function getGrantSummary(selected: string[]) {
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

    let {
        grant,
        base,
        choices,
        count,
        selected: preSelected,
        traitType,
        updateSelectionFunc = undefined,
    }: Props = $props();

    const configObject = prepareTraitGrantConfigObject();
    let choicesLocked = $state(true);

    let selected = $derived([...new Set(base.concat(preSelected))]);
    let totalCount = $derived(base.length + count);
    let remainingSelections = $derived(totalCount - selected.length);
    let summary = $derived(getGrantSummary(selected));
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
            {onUpdateSelection}
        />
    </FieldWrapper>

    <FieldWrapper>
        {summary}
    </FieldWrapper>
</Section>
