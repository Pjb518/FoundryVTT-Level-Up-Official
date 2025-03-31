<script lang="ts">
    import type { ActorFeatureGrant } from "../../../dataModels/actor/grants/ActorDocumentGrant";
    import type FeatureGrant from "../../../dataModels/item/Grants/FeatureGrant";

    import { getContext, createEventDispatcher } from "svelte";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    type FeatureOption = {
        uuid: string;
        limitedReselection: boolean;
        selectionLimit: number;
    };

    export let grant: FeatureGrant;
    export let base: FeatureOption[];
    export let choices: FeatureOption[];
    export let count: number;
    export let selected: string[];

    const dispatch = createEventDispatcher();
    const actor: typeof Actor = getContext("actor");

    function getGrantSummary(selected: string[]) {
        // return ` This grant provides a bonus of ${bonus} to ${selected
        //     .map((s) => configObject[s])
        //     .join(", ")}.`;
        return "";
    }

    function onUpdateSelection({ detail }: { detail: string[] }) {
        selectedOptions = detail;
        dispatch("updateSelection", { uuids: selectedOptions, summary });
    }

    function getExistingSelections(): Set<string> {
        const selections: string[] = [];

        [...actor.grants.grantedFeatureDocuments.entries()].forEach(
            ([docId, grantIds]: [string, string[]]) => {
                const data = featureDataMap.get(docId);
                if (!data) return selections.push(docId);

                const takenCount = grantIds.length;
                if (
                    !data.limitedReselection ||
                    data.selectionLimit > takenCount
                )
                    return;

                selections.push(docId);
            },
        );

        return new Set(selections);
    }

    function getDisabledOptions() {
        const disabled: string[] = [];

        for (const [value] of allOptions) {
            const strippedId = value.split(".").pop();
            const alreadyTaken = existingSelections.has(strippedId || "");
            if (alreadyTaken) {
                disabled.push(value);
            }
        }

        return disabled;
    }

    function getOptions(choicesLocked: boolean): string[][] {
        if (!choicesLocked) return allOptions;

        const options: string[][] = [];

        for (const [value, label] of allOptions) {
            const strippedId = value.split(".").pop();
            const alreadyTaken = existingSelections.has(strippedId || "");

            if (choicesUuids.includes(value) && !alreadyTaken) {
                options.push([value, label]);
            }
        }

        return options;
    }

    const allOptions: string[][] = [...base, ...choices].map((o) => {
        const doc = fromUuidSync(o.uuid);
        return [o.uuid, doc.name];
    });

    const featureDataMap = base.concat(choices).reduce((acc, f) => {
        const docId = f.uuid.split(".").pop();
        if (!docId) return acc;

        acc.set(docId, f);
        return acc;
    }, new Map<string, FeatureOption>());

    const choicesUuids = choices.map((o) => o.uuid);
    let choicesLocked = true;
    let existingSelections = getExistingSelections();
    let disabledOptions = getDisabledOptions();

    $: selectedOptions = [...new Set(base.map((o) => o.uuid).concat(selected))];
    $: totalCount = base.length + count;
    $: remainingSelections = totalCount - selectedOptions.length;
    $: summary = getGrantSummary(selectedOptions);
</script>

<Section
    heading="Feature Grant - {grant.label}"
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
        showWarning={selectedOptions.length < totalCount}
        --direction="column"
    >
        <CheckboxGroup
            options={getOptions(choicesLocked)}
            selected={selectedOptions}
            orange={choices.map((o) => o.uuid)}
            disabled={selectedOptions.length >= totalCount}
            {disabledOptions}
            on:updateSelection={onUpdateSelection}
        />
    </FieldWrapper>

    <FieldWrapper>
        {summary}
    </FieldWrapper>
</Section>
