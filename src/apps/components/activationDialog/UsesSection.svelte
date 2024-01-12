<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext } from "svelte";

    import FieldWrapper from "../FieldWrapper.svelte";

    import getDeterministicBonus from "../../../dice/getDeterministicBonus";
    import showActivationDialogSection from "../../../utils/showActivationDialogSection";

    export let consumers;
    export let actionUsesData;
    export let itemUsesData;

    function getActionConsumer(consumers) {
        if (foundry.utils.isEmpty(consumers.actionUses)) return null;
        const [_, consumer] = Object.values(consumers.actionUses);
        return consumer;
    }

    function getItemConsumer(consumers) {
        if (foundry.utils.isEmpty(consumers.itemUses)) return null;
        const [_, consumer] = Object.values(consumers.itemUses);
        return consumer;
    }

    const actor = getContext("actor");
    const actionId = getContext("actionId");
    const item = getContext("item");
    const action = $item.actions[actionId];

    // =======================================================
    // Consumer data
    const actionConsumer = getActionConsumer(consumers);
    const itemConsumer = getItemConsumer(consumers);

    actionUsesData.quantity = actionConsumer?.quantity ?? 1;
    actionUsesData.baseUses = actionConsumer?.quantity ?? 1;
    itemUsesData.quantity = itemConsumer?.quantity ?? 1;
    itemUsesData.baseUses = itemConsumer?.quantity ?? 1;

    $: actionUses = $item.actions[actionId].uses ?? {};
    $: itemUses = $item.system.uses;
    $: itemMaxUses = getDeterministicBonus(itemUses.max, $actor.getRollData());

    $: actionMaxUses = getDeterministicBonus(
        actionUses?.max ?? 0,
        $actor.getRollData(),
    );
</script>

<div class="side-by-side">
    {#if showActivationDialogSection(action, ["actionUses"], ["actionUses"]) && actionUses?.max}
        <FieldWrapper heading="A5E.ActionUses">
            <div class="u-flex u-gap-md u-align-center">
                <div class="u-flex u-w-10">
                    <input
                        class="number-input"
                        type="number"
                        bind:value={actionUsesData.quantity}
                        min="0"
                        max={actionUses.max}
                    />
                </div>

                <p class="u-text-xs">
                    ( {actionUses.value} / {actionMaxUses}
                    {localize("A5E.UsesRemaining")})
                </p>
            </div>
        </FieldWrapper>
    {/if}

    {#if showActivationDialogSection(action, ["itemUses"], ["itemUses"]) && itemUses?.max}
        <FieldWrapper heading="A5E.ItemUses">
            <div class="u-flex u-gap-md u-align-center">
                <div class="u-flex u-w-10">
                    <input
                        class="number-input"
                        type="number"
                        bind:value={itemUsesData.quantity}
                        min="0"
                        max={itemUses.max}
                    />
                </div>

                <p class="u-text-xs">
                    ( {itemUses.value} / {itemMaxUses}
                    {localize("A5E.UsesRemaining")})
                </p>
            </div>
        </FieldWrapper>
    {/if}
</div>

<style lang="scss">
    .side-by-side {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, auto));
        gap: 0.5rem;
    }

    .number-input {
        background: transparent;
        border: 1px solid #bbb;
        height: 1.125rem;
        width: 7ch;
        font-size: $font-size-xs;
        text-align: center;

        &:hover {
            border: 1px solid #bbb;
        }
    }
</style>
