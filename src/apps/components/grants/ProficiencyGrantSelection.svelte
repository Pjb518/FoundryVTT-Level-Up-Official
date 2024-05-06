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

        if (["weapon", "tool"].includes(proficiencyType)) {
            const config: Record<string, string>[] = Object.values(
                configObject[proficiencyType]?.config ?? {},
            );

            config.forEach((category) => {
                for (const [value, label] of Object.entries(category)) {
                    if (choices.includes(value)) options.push([value, label]);
                }
            });

            return options;
        }

        if (!choicesLocked) return configObject[proficiencyType]?.config ?? [];

        for (const [value, label] of configObject[proficiencyType]?.config ??
            []) {
            if (choices.includes(value)) {
                options.push([value, label]);
            }
        }

        return options;
    }

    const dispatch = createEventDispatcher();
    const configObject = prepareProficiencyConfigObject();

    let choicesLocked = true;

    $: selected = [...base];
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
