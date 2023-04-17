<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";
    import prepareHitDice from "../../dataPreparationHelpers/prepareHitDice";

    import RadioGroup from "../RadioGroup.svelte";

    export let consumer;
    export let consumerId;

    const item = getContext("item");
    const actionId = getContext("actionId");

    function updateSelection() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.defaultDie`,
            selected
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

<section class="action-config__wrapper">
    <div class="a5e-field-group a5e-field-group--label">
        <label for="{actionId}-{consumerId}-label">
            {localize("A5E.Label")}
        </label>
        <input
            id="{actionId}-{consumerId}-label"
            name="{actionId}-{consumerId}-label"
            type="text"
            value={consumer.label ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.consumers.${consumerId}.label`,
                    target.value
                )}
        />
    </div>

    <!-- Select HIt Dice that can be consumed -->
    <!-- <div class="a5e-field-group">
        {#if $item.actor}
            <h3 class="a5e-field-group__heading">
                {localize("A5E.ConsumerHitDiceDefault")}
            </h3>

            <RadioGroup
                allowDeselect={false}
                options={availableHitDice}
                {selected}
                on:updateSelection={({ detail }) => (selected = detail)}
            />
        {:else}
            <p class="a5e-field-group__hint" style="color: #8b6225;">
                <i class="fa-solid fa-circle-exclamation" />
                Hit Dice selection will be available when item is on an actor.
            </p>
        {/if}
    </div>

    <div class="a5e-field-group">
        <div class="u-flex u-flex-col u-gap-sm u-w-fit">
            <h3 class="a5e-field-group__heading">Default Consumption Amount</h3>
            <input
                type="number"
                d-type="Number"
                value={consumer.quantity ?? 1}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.consumers.${consumerId}.quantity`,
                        Number(target.value)
                    )}
            />
        </div>
    </div> -->

    <!-- Add resource to add ish too -->
</section>
