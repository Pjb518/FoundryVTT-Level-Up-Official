<script lang="ts">
    import type { BaseActorA5e } from "../../../documents/actor/base";
    import type { ConsumerHandlerReturnType } from "../../dataPreparationHelpers/itemActivationConsumers/prepareConsumers";
    import type { ItemA5e } from "../../../documents/item/item";
    // import type { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import { localize } from "#utils/localization/localize.ts";
    import { getContext } from "svelte";

    import { ResourceConsumptionManager } from "../../../managers/ResourceConsumptionManager";

    import FieldWrapper from "../FieldWrapper.svelte";

    import showActivationDialogSection from "../../../utils/showActivationDialogSection";

    export let consumers: ConsumerHandlerReturnType;
    export let selectedConsumers: string[];
    export let actionUsesData: ResourceConsumptionManager.UsesConsumerData;
    export let itemUsesData: ResourceConsumptionManager.UsesConsumerData;

    const actor: TJSDocument<BaseActorA5e> = getContext("actor");
    const item: TJSDocument<ItemA5e> = getContext("item");
    const actionId: string = getContext("actionId");
    const action = $item.actions.get(actionId)!;

    let parts = ResourceConsumptionManager.prepareUsesData(
        $actor,
        $item,
        consumers,
        actionId,
    );

    // =======================================================
    // Consumer data
    actionUsesData = parts.actionUsesData;
    itemUsesData = parts.itemUsesData;

    $: actionUses = parts.actionUses;
    $: actionMaxUses = parts.actionMaxUses;
    $: itemUses = parts.itemUses;
    $: itemMaxUses = parts.itemMaxUses;
</script>

<div class="side-by-side">
    {#if showActivationDialogSection(action, selectedConsumers, ["actionUses"], ["actionUses"]) && actionUses?.max}
        <FieldWrapper heading="A5E.actions.headings.uses">
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
                    {localize("A5E.consumers.uses.remaining")})
                </p>
            </div>
        </FieldWrapper>
    {/if}

    {#if showActivationDialogSection(action, selectedConsumers, ["itemUses"], ["itemUses"]) && itemUses?.max}
        <FieldWrapper heading="A5E.consumers.usesItem">
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
                    {localize("A5E.consumers.uses.remaining")})
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
        font-size: var(--a5e-text-size-xs);
        text-align: center;

        &:hover {
            border: 1px solid #bbb;
        }
    }
</style>
