<script lang="ts">
    import type FeatureGrant from "../../../dataModels/item/Grants/FeatureGrant.ts";

    import { getContext } from "svelte";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        grant: FeatureGrant;
        base: FeatureOption[];
        choices: FeatureOption[];
        count: number;
        selected: string[];
        updateSelectionFunc?: (value: any) => void;
    };

    type FeatureOption = {
        uuid: string;
        limitedReselection: boolean;
        selectionLimit: number;
    };

    function getGrantSummary(selected: string[]) {
        // return ` This grant provides a bonus of ${bonus} to ${selected
        //     .map((s) => configObject[s])
        //     .join(", ")}.`;
        return "";
    }

    function onUpdateSelection(value: string[]) {
        selectedOptions = value;
        updateSelectionFunc?.({ uuids: selectedOptions, summary });
    }

    function getExistingSelections(): Set<string> {
        const selections: string[] = [];

        [...actor.reactive.grants.grantedFeatureDocuments.entries()].forEach(
            ([docId, grantIds]: [string, string[]]) => {
                const data = featureDataMap.get(docId);
                if (!data) return selections.push(docId);

                const takenCount = grantIds.length;
                if (!data.limitedReselection || data.selectionLimit > takenCount) return;

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

    function getPrerequisites(): string[] {
        const prereqs: string[] = [];

        for (const [value] of allOptions) {
            const doc = fromUuidSync(value);
            if (doc?.system.prerequisite) {
                prereqs.push(value);
            }
        }

        return prereqs;
    }

    let {
        grant,
        base,
        choices,
        count,
        selected: preSelected,
        updateSelectionFunc = undefined,
    }: Props = $props();

    let allOptions: string[][] = [...base, ...choices].map((o) => {
        const doc = fromUuidSync(o.uuid);
        return [o.uuid, doc.name];
    });

    let featureDataMap = base.concat(choices).reduce((acc, f) => {
        const docId = f.uuid.split(".").pop();
        if (!docId) return acc;

        acc.set(docId, f);
        return acc;
    }, new Map<string, FeatureOption>());

    let actor: Actor = getContext("actor");

    let choicesUuids = choices.map((o) => o.uuid);
    let choicesLocked = $state(true);
    let existingSelections = getExistingSelections();
    let disabledOptions = getDisabledOptions();

    let selectedOptions = $derived([
        ...new Set(base.map((o) => o.uuid).concat(preSelected)),
    ]);
    let totalCount = $derived(base.length + count);
    let remainingSelections = $derived(totalCount - selectedOptions.length);
    let summary = $derived(getGrantSummary(selectedOptions));
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
            tooltip: choicesLocked ? "Locked to Grant Options" : "Free Selection Mode",
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
            {onUpdateSelection}
            icon="fa-solid fa-key"
            iconList={getPrerequisites()}
        />
    </FieldWrapper>

    <FieldWrapper>
        {summary}
    </FieldWrapper>
</Section>
