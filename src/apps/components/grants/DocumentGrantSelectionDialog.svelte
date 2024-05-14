<script lang="ts">
    import type FeatureGrant from "../../../dataModels/item/Grants/FeatureGrant";

    import { getContext, createEventDispatcher } from "svelte";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    export let grant: FeatureGrant;
    export let base: string[];
    export let choices: string[];
    export let count: number;
    export let documentType: string;
    export let selected: string[];

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

    function getExistingSelections() {
        const selections: string[] = [];
        if (documentType === "item") return new Set(selections);

        actor.grants.byType("feature").forEach((grant) => {
            selections.push(...grant.documentIds);
        });

        return new Set(selections);
    }

    function getDisabledOptions() {
        if (documentType === "item") return [];

        const disabled: string[] = [];
        for (const [value] of allOptions) {
            const strippedId = value.split(".").pop();
            const alreadyTaken = existingSelections.has(strippedId);
            if (alreadyTaken) {
                disabled.push(value);
            }
        }

        return disabled;
    }

    function getOptions(choicesLocked: boolean): string[][] {
        if (!choicesLocked || documentType === "item") return allOptions;

        const options: string[][] = [];
        for (const [value, label] of allOptions) {
            const strippedId = value.split(".").pop();
            const alreadyTaken = existingSelections.has(strippedId);
            if (choices.includes(value) && !alreadyTaken) {
                options.push([value, label]);
            }
        }

        return options;
    }

    const dispatch = createEventDispatcher();
    const actor: typeof Actor = getContext("actor");
    let choicesLocked = true;
    let existingSelections = getExistingSelections();
    let disabledOptions = getDisabledOptions();

    $: selected = [...base, ...selected];
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
