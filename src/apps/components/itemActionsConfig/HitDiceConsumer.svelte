<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    import prepareHitDice from "../../dataPreparationHelpers/prepareHitDice";

    import FieldWrapper from "../FieldWrapper.svelte";

    export let consumer;
    export let consumerId;
    export let deleteConsumer;

    const item = getContext("item");
    const actionId = getContext("actionId");

    function updateSelection() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.defaultDie`,
            selected,
        );
    }

    const hitDice = $item.actor ? prepareHitDice($item.actor) : [];
    const availableHitDice = hitDice.reduce((acc, { die, total }) => {
        if (total > 0) acc.push([die, die]);
        return acc;
    }, []);

    const defaultSelection = availableHitDice.length
        ? availableHitDice[0][0]
        : "";

    $: selected = consumer.defaultDie ?? defaultSelection;
    $: selected, updateSelection();

    if (!selected) updateSelection();
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes: "fa-solid fa-trash",
            handler: () => deleteConsumer(actionId, consumerId),
        },
    ]}
    --a5e-header-button-color="rgba(0, 0, 0, 0.2)"
    --a5e-header-button-color-hover="#555"
>
    <input
        type="text"
        value={consumer.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.consumers.${consumerId}.label`,
                target.value,
            )}
    />
</FieldWrapper>
