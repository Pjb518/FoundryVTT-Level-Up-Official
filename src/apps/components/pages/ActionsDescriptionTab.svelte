<script>
    import { getContext } from "svelte";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import Editor from "../Editor.svelte";
    import ItemSummary from "../itemSummaries/ItemSummary.svelte";

    import getSummaryData from "../../../utils/summaries/getSummaryData";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let summaryData = {};

    const item = getContext("item");
    const actionId = getContext("actionId");

    const descriptionOutputOptions = [
        ["action", "A5E.ActionActivationAction"],
        ["item", "A5E.Item"],
    ];

    $: content = $item.system.actions[actionId]?.description;
    $: descriptionOutputs = $item.system.actions[actionId]
        ?.descriptionOutputs ?? ["item"];

    $: summaryData = getSummaryData($item, $item.actions.get(actionId));
</script>

{#if Object.values(summaryData ?? {}).some(Boolean)}
    <ItemSummary {summaryData} --inline-padding="0.25rem" />

    <hr class="a5e-rule a5e-rule--card" />
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <CheckboxGroup
        heading="A5E.ActionDescriptionOptions"
        hint="A5E.ActionDescriptionOptionsHint"
        options={descriptionOutputOptions}
        selected={descriptionOutputs}
        on:updateSelection={({ detail }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.descriptionOutputs`,
                detail,
            )}
    />

    <Editor
        document={item}
        {content}
        updatePath={`system.actions.${actionId}.description`}
    />
</section>
