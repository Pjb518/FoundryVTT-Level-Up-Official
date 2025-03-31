<script lang="ts">
    import type { ProficiencyGrant } from "types/itemGrants";

    import { createEventDispatcher } from "svelte";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";
    import prepareProficiencyConfigObject from "../../../utils/prepareProficiencyConfigObject";

    export let grant: ProficiencyGrant;
    export let base: string[];
    export let choices: string[];
    export let count: number;
    export let proficiencyType: string;
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

    const dispatch = createEventDispatcher();
    const configObject = prepareProficiencyConfigObject();

    let choicesLocked = true;

    $: selected = [...new Set(base.concat(selected))];
    $: totalCount = base.length + count;
    $: remainingSelections = totalCount - selected.length;
    $: summary = getGrantSummary(selected);
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
            on:updateSelection={onUpdateSelection}
        />
    </FieldWrapper>

    <FieldWrapper>
        {summary}
    </FieldWrapper>
</Section>
