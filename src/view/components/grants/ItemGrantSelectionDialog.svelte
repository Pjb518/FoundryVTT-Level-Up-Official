<script lang="ts">
    import type { ItemGrant } from "#types/itemGrants.d.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        grant: ItemGrant;
        base: string[];
        choices: string[];
        count: number;
        selected: string[];
        updateSelectionFunc?: (value: any) => void;
    };

    function getGrantSummary(selected: string[]) {
        // return ` This grant provides a bonus of ${bonus} to ${selected
        //     .map((s) => configObject[s])
        //     .join(", ")}.`;
        return "";
    }

    function onUpdateSelection(value: string[]) {
        selected = value;
        updateSelectionFunc?.({ uuids: selected, summary });
    }

    async function openDocument(uuid: string) {
        const doc = await fromUuid(uuid);
        doc.sheet.render(true);
    }

    let {
        grant,
        base,
        choices,
        count,
        selected: preSelected,
        updateSelectionFunc = undefined,
    }: Props = $props();

    const options = [...base, ...choices]
        .map((uuid) => {
            const doc = fromUuidSync(uuid);
            if (!doc) {
                ui.notifications?.error(
                    `Could not find document with UUID ${uuid} in grant ${grant.label}.`,
                );
                return null;
            }

            return [uuid, doc.name];
        })
        .filter(Boolean) as [string, string][];

    let selected = $derived([...new Set(base.concat(preSelected))]);
    let totalCount = $derived(base.length + count);
    let remainingSelections = $derived(totalCount - selected.length);
    let summary = $derived(getGrantSummary(selected));
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
            disabled={selected.length >= totalCount}
            {onUpdateSelection}
            onTagToggleAux={openDocument}
        />
    </FieldWrapper>

    <FieldWrapper>
        {summary}
    </FieldWrapper>
</Section>
