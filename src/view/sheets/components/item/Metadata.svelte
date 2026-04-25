<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import Section from "#view/snippets/Section.svelte";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);

    let editMode = $state(false);
</script>

<Section
    heading="Metadata"
    headerButtons={[
        {
            classes: `icon fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <Checkbox
            label="A5E.metadata.favorite.setting"
            checked={itemStore.favorite}
            onUpdateSelection={(detail) => {
                updateDocumentDataFromField(item, "system.favorite", detail);
            }}
        />

        {#if item.type === "feature"}
            <Checkbox
                label="A5E.metadata.hidden.setting"
                checked={itemStore.hidden}
                onUpdateSelection={(detail) => {
                    updateDocumentDataFromField(item, "system.hidden", detail);
                }}
            />
        {/if}
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.metadata.favorite.title")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {itemStore.favorite ? "Yes" : "No"}
                </dd>
            </div>
            {#if item.type === "feature"}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.metadata.hidden.title")}:
                    </dt>

                    <dd class="a5e-dl-box__content">
                        {itemStore.hidden ? "Yes" : "No"}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</Section>
