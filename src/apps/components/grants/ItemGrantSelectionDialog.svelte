<script lang="ts">
    import type { ItemGrant } from "types/itemGrants";

    import { getContext, createEventDispatcher } from "svelte";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    export let grant: ItemGrant;
    export let base: string[];
    export let choices: string[];
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
        selected = detail;
        dispatch("updateSelection", { uuids: selected, summary });
    }

    const options = [...base, ...choices].map((uuid) => {
        const doc = fromUuidSync(uuid);
        return [uuid, doc.name];
    });

    $: selected = [...base, ...selected];
    $: totalCount = base.length + count;
    $: remainingSelections = totalCount - selected.length;
    $: summary = getGrantSummary(selected);
</script>

<Section heading="Item Grant - {grant.label}" --a5e-section-body-gap="0.75rem">
    <FieldWrapper
        warning={remainingSelections === 1
            ? "1 choice remaining"
            : `${remainingSelections} choices remaining.`}
        showWarning={selected.length < totalCount}
    >
        <CheckboxGroup
            {options}
            {selected}
            orange={choices}
            on:updateSelection={onUpdateSelection}
        />
    </FieldWrapper>

    <FieldWrapper>
        {summary}
    </FieldWrapper>
</Section>
