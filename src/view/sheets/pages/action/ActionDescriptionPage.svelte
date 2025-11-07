<script lang="ts">
    import type { Action } from "#types/action.js";
    import { getContext } from "svelte";

    import { getSummaryData } from "#utils/summaries/getSummaryData.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import Editor from "#view/components/Editor.svelte";
    import ItemSummary from "#view/sheets/components/item/ItemSummary.svelte";

    let item: any = getContext("item");
    let actionId: string = getContext("actionId");

    let action: Action = $derived(item.reactive.actions.get(actionId));

    const descriptionOutputOptions = [
        ["action", "A5E.actions.headings.activation.action"],
        ["item", "A5E.items.title"],
    ];

    let descriptionOutputs = $derived(action.descriptionOutputs ?? ["item"]);
    let summaryData = $derived(getSummaryData(item.reactive, action));
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    {#if Object.values(summaryData ?? {}).some(Boolean)}
        <ItemSummary {summaryData} --inline-padding="0.25rem" />

        <hr class="a5e-rule a5e-rule--card" />
    {/if}

    <CheckboxGroup
        heading="A5E.actions.headings.descriptionOptions"
        hint="A5E.actions.hints.descriptionOptions"
        options={descriptionOutputOptions}
        selected={descriptionOutputs}
        onUpdateSelection={(values) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.descriptionOutputs`,
                values,
            )}
    />

    {#key action.description}
        <Editor
            content={action.description}
            document={item}
            documentUuid={item.uuid}
            field="system.actions.{actionId}.description"
            manageSecrets={item.isOwner}
        />
    {/key}
</section>
