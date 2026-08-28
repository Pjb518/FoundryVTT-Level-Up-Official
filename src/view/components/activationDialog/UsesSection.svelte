<script lang="ts">
    import { getContext } from "svelte";
    import type { ItemA5e } from "#documents/item/item.ts";
    import { ResourceConsumptionManager } from "#managers/ResourceConsumptionManager.ts";
    import type { RollStateManager } from "#managers/RollStateManager.ts";
    import { localize } from "#utils/localization/localize.ts";

    import showActivationDialogSection from "#utils/showActivationDialogSection.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        actionUsesConsumer: RollStateManager.state["consumers"]["actionUses"];
        itemUsesConsumer: RollStateManager.state["consumers"]["itemUses"];
        selectedConsumers: string[];
        actionUsesData: ResourceConsumptionManager.UsesConsumerData;
        itemUsesData: ResourceConsumptionManager.UsesConsumerData;
    };

    let {
        actionUsesConsumer,
        itemUsesConsumer,
        selectedConsumers,
        actionUsesData = $bindable(),
        itemUsesData = $bindable(),
    }: Props = $props();

    let actor: Actor.OfType<"base"> = getContext("actor");
    let item: ItemA5e = getContext("item");
    let actionId: string = getContext("actionId");
    let action = $derived(item.reactive.actions.get(actionId)!);

    let partsA = $state(actionUsesConsumer?.getActivationData(actor, item));
    let partsI = $state(itemUsesConsumer?.getActivationData(actor, item));

    // =======================================================
    // Consumer data
    actionUsesData = {
        baseUses: partsA?.baseUses || 1,
        quantity: partsA?.quantity || 1,
    };
    itemUsesData = {
        baseUses: partsI?.baseUses || 1,
        quantity: partsI?.quantity || 1,
    };

    let actionUses = $derived(partsA?.actionUses ?? {});
    let actionMaxUses = $derived(partsA?.maxUses || 0);
    let itemUses = $derived(partsI?.itemUses ?? {});
    let itemMaxUses = $derived(partsI?.maxUses || 0);
</script>

<div class="side-by-side">
    {#if showActivationDialogSection(action, selectedConsumers, ["actionUses"], ["actionUses"]) && actionUses?.max}
        <FieldWrapper
            heading="A5E.actions.headings.uses"
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-header-width="100%"
            --a5e-field-wrapper-item-alignment="center"
        >
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                bind:value={actionUsesData.quantity}
                min="0"
                max={actionUses.max}
            />

            <p class="small-text">
                ( {actionUses.value} / {actionMaxUses}
                {localize("A5E.consumers.uses.remaining")})
            </p>
        </FieldWrapper>
    {/if}

    {#if showActivationDialogSection(action, selectedConsumers, ["itemUses"], ["itemUses"]) && itemUses?.max}
        <FieldWrapper
            heading="A5E.consumers.usesItem"
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-header-width="100%"
            --a5e-field-wrapper-item-alignment="center"
        >
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                bind:value={itemUsesData.quantity}
                min="0"
                max={itemUses.max}
            />

            <p class="small-text">
                ( {itemUses.value} / {itemMaxUses}
                {localize("A5E.consumers.uses.remaining")})
            </p>
        </FieldWrapper>
    {/if}
</div>

<style lang="scss">
    .side-by-side {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, auto));
        gap: 0.5rem;
    }

    .small-text {
        font-size: var(--a5e-xs-text);
    }
</style>
