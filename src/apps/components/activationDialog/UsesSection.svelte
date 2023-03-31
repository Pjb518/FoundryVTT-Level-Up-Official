<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import FormSection from "../FormSection.svelte";

    import getDeterministicBonus from "../../../dice/getDeterministicBonus";

    export let consumers;
    export let actionUsesData;
    export let itemUsesData;

    function getActionConsumer(consumers) {
        if (foundry.utils.isEmpty(consumers.actionUses)) return null;

        const [actionUses] = Object.values(consumers.actionUses);

        if (foundry.utils.isEmpty(actionUses)) return null;

        return actionUses[1];
    }

    const actor = getContext("actor");
    const item = getContext("item");

    // =======================================================
    // Consumer data
    const actionConsumer = getActionConsumer(consumers);

    actionUsesData.quantity = 1;
    itemUsesData.quantity = 1;

    $: itemUses = $item.system.uses;

    $: actionMaxUses = getDeterministicBonus(
        actionConsumer?.max ?? 0,
        $actor.getRollData()
    );

    $: itemMaxUses = getDeterministicBonus(itemUses.max, $actor.getRollData());
</script>

<div class="side-by-side">
    {#if actionConsumer?.value}
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
                            bind:value={actionUsesData.quantity}
                            min="0"
                            max={actionConsumer.max}
                        />
                    </div>

                    <p class="u-text-xs">
                        ( {actionConsumer.value} / {actionMaxUses}
                        {localize("A5E.UsesRemaining")})
                    </p>
                </div>
            </section>
        </FormSection>
    {/if}

    {#if itemUses.value}
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
