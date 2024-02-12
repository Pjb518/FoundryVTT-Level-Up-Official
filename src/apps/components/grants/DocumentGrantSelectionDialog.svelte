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

    const dispatch = createEventDispatcher();

    $: selected = [...base];
    $: remainingSelections = count - selected.length;
    $: summary = getGrantSummary(selected);

    $: options = [...base, ...choices].map((uuid) => {
        const doc = fromUuidSync(uuid);
        return [doc.uuid, doc.name];
    });
</script>

<Section heading={getHeading()} --a5e-section-body-gap="0.75rem">
    <FieldWrapper
        warning={remainingSelections === 1
            ? `1 choice remaining`
            : `${count - selected.length} choices remaining.`}
        showWarning={selected.length < count}
        --direction="column"
    >
        <CheckboxGroup
            {options}
            {selected}
            orange={choices}
            disabled={selected.length >= count}
            on:updateSelection={onUpdateSelection}
        />
    </FieldWrapper>

    <FieldWrapper>
        {summary}
    </FieldWrapper>
</Section>

<style lang="scss">
</style>
