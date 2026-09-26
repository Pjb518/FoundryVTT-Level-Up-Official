<script lang="ts">
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
</script>

<Section
    heading="A5E.tabs.hackingProperties"
    --a5e-section-body-gap="0.75rem"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    <FieldWrapper heading="A5E.hacking.diceCost">
        <input
            class="a5e-input a5e-input--slim a5e-input--small"
            type="number"
            name="system.diceCost"
            value={itemStore.diceCost ?? 0}
            min="0"
            id="{item.uuid}-dice-cost"
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    item,
                    "system.diceCost",
                    Number(currentTarget.value),
                )}
        />
    </FieldWrapper>
</Section>
