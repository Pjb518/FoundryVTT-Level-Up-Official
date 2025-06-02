<script lang="ts">
    import type { ProficiencyGrant } from "#types/itemGrants.d.ts";

    import prepareProficiencyConfigObject from "../../../utils/prepareProficiencyConfigObject";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        grant: ProficiencyGrant;
        base: string[];
        choices: string[];
        count: number;
        proficiencyType: string;
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
        const options: string[][] = [];
        let optionKeys: string[];

        if (["weapon", "tool"].includes(proficiencyType)) {
            const config: Record<string, string>[] = Object.values(
                configObject[proficiencyType]?.config ?? {},
            );

            optionKeys = config.flatMap((category) => {
                return Object.entries(category).map(([key]) => key);
            });
        } else {
            optionKeys =
                configObject[proficiencyType]?.config.map(([key]) => key) ?? [];
        }

        const extra = choices.filter((c) => !optionKeys.includes(c));
        const totalOptions = [
            ...(["weapon", "tool"].includes(proficiencyType)
                ? Object.values(
                      (configObject[proficiencyType]?.config ?? {}) as Record<
                          string,
                          string
                      >,
                  ).flatMap((category) => Object.entries(category))
                : (configObject[proficiencyType]?.config ?? [])),
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
        proficiencyType,
        selected: preSelected,
        updateSelectionFunc = undefined,
    }: Props = $props();

    const configObject = prepareProficiencyConfigObject();

    let choicesLocked = $state(true);

    let selected = $derived([...new Set(base.concat(preSelected))]);
    let totalCount = $derived(base.length + count);
    let remainingSelections = $derived(totalCount - selected.length);
    let summary = $derived(getGrantSummary(selected));
</script>

<Section
    heading="Proficiency Grant - {grant.label}"
    headerButtons={["tools", "weapons"].includes(proficiencyType)
        ? []
        : [
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
