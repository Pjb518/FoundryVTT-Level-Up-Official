<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import FormSection from "../FormSection.svelte";

    import getDeterministicBonus from "../../../dice/getDeterministicBonus";

    export let consumers;
    export let usesData;

    function getConsumer(consumers, type) {
        if (foundry.utils.isEmpty(consumers.uses)) return null;
        const [uses] = Object.values(consumers.uses);
        if (foundry.utils.isEmpty(uses)) return null;

        const consumeType =
            uses[1].consumeType === "both" ? type : uses[1].consumeType;

        // Update consumeData as well
        usesData.consumeType = uses[1].consumeType;

        return type === consumeType ? uses[1] : null;
    }

    const actor = getContext("actor");
    const actionId = getContext("actionId");
    const item = getContext("item");

    // =======================================================
    // Consumer data
    const actionConsumer = getConsumer(consumers, "action");
    const itemConsumer = getConsumer(consumers, "item");

    usesData.itemQuantity = itemConsumer?.quantity ?? 0;
    usesData.actionQuantity = actionConsumer?.quantity ?? 0;

    $: actionUses = $item.actions[actionId].uses ?? {};
    $: itemUses = $item.system.uses;

    $: actionMaxUses = getDeterministicBonus(
        actionUses?.max ?? 0,
        $actor.getRollData()
    );
    $: itemMaxUses = getDeterministicBonus(itemUses.max, $actor.getRollData());
</script>

<div class="side-by-side">
    {#if actionConsumer && actionUses?.max}
        <FormSection>
            <section>
                <h3 class="u-text-bold u-text-sm">
                    {localize("A5E.ActionUses")}
                </h3>

                <div class="u-flex u-gap-md u-align-center">
                    <div class="u-flex u-w-10">
                        <input
                            class="number-input"
                            type="number"
                            bind:value={usesData.actionQuantity}
                            min="0"
                            max={actionUses.max}
                        />
                    </div>

                    <p class="u-text-xs">
                        ( {actionUses.value} / {actionMaxUses}
                        {localize("A5E.UsesRemaining")})
                    </p>
                </div>
            </section>
        </FormSection>
    {/if}

    {#if itemConsumer && itemUses?.max}
        <FormSection>
            <section>
                <h3 class="u-text-bold u-text-sm">
                    {localize("A5E.ItemUses")}
                </h3>

                <div class="u-flex u-gap-md u-align-center">
                    <div class="u-flex u-w-10">
                        <input
                            class="number-input"
                            type="number"
                            bind:value={usesData.itemQuantity}
                            min="0"
                            max={itemUses.max}
                        />
                    </div>

                    <p class="u-text-xs">
                        ( {itemUses.value} / {itemMaxUses}
                        {localize("A5E.UsesRemaining")})
                    </p>
                </div>
            </section>
        </FormSection>
    {/if}
</div>

<style lang="scss">
    section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
    }

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
        font-size: 0.694rem;
        text-align: center;

        &:hover {
            border: 1px solid #bbb;
        }
    }
</style>
