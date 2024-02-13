<script lang="ts">
    import type FeatureGrant from "../../../dataModels/item/Grants/FeatureGrant";

    import { createEventDispatcher } from "svelte";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    export let grant: FeatureGrant;
    export let base: string[];
    export let choices: string[];
    export let count: number;
    export let documentType: string;

    const allOptions = [...base, ...choices].map((uuid) => {
        const doc = fromUuidSync(uuid);
        return [uuid, doc.name];
    });

    function getGrantSummary(selected: string[]) {
        // return ` This grant provides a bonus of ${bonus} to ${selected
        //     .map((s) => configObject[s])
        //     .join(", ")}.`;
        return "";
    }

    function getHeading(): string {
        if (documentType === "feature") return `Feature Grant - ${grant.label}`;
        return `Item Grant - ${grant.label}`;
    }

    function onUpdateSelection({ detail }: { detail: string[] }) {
        selected = detail;
        dispatch("updateSelection", { uuids: selected, summary });
    }

    function getOptions(choicesLocked: boolean): string[][] {
        if (!choicesLocked) return allOptions;

        const options: string[][] = [];
        for (const [value, label] of allOptions) {
            if (choices.includes(value)) {
                options.push([value, label]);
            }
        }

        return options;
    }

    const dispatch = createEventDispatcher();
    let choicesLocked = true;

    $: selected = [...base];
    $: totalCount = base.length + count;
    $: remainingSelections = totalCount - selected.length;
    $: summary = getGrantSummary(selected);
</script>

<Section
    heading={getHeading()}
    headerButtons={[
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

<style lang="scss">
</style>
