<script lang="ts">
    import type { ConsumerProps } from "./data.ts";

    import { getContext } from "svelte";
    import { prepareHitDice } from "#utils/view/helpers/prepareHitDice.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    function updateSelection(value: string) {
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.consumers.${consumerId}.itemId`,
            value,
        );
    }

    let { consumer, consumerId, deleteConsumer }: ConsumerProps = $props();

    const item: any = getContext("item");
    const actionId: string = getContext("actionId");

    let hitDice = $derived(
        item.actor ? prepareHitDice(item.actor.reactive) : [],
    );

    let availableHitDice = $derived(
        hitDice.reduce((acc, { die, total }) => {
            if (total > 0) acc.push([die, die]);
            return acc;
        }, [] as string[][]),
    );

    let defaultSelection = $derived(
        availableHitDice.length ? availableHitDice[0][0] : "",
    );

    let selected = $derived(consumer.defaultDie ?? defaultSelection);
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes: "icon fa-solid fa-trash",
            handler: () => deleteConsumer(actionId, consumerId),
        },
    ]}
>
    <input
        class="a5e-input a5e-input--slim"
        type="text"
        value={consumer.label ?? ""}
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.consumers.${consumerId}.label`,
                currentTarget.value,
            )}
    />
</FieldWrapper>
