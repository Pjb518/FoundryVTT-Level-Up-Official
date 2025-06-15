<script lang="ts">
    import type { ConsumerHandlerReturnType } from "../../../apps/dataPreparationHelpers/itemActivationConsumers/prepareConsumers.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import showActivationDialogSection from "#utils/showActivationDialogSection.ts";
    import { ResourceConsumptionManager } from "#managers/ResourceConsumptionManager.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        consumers: ConsumerHandlerReturnType;
        selectedConsumers: string[];
        actionUsesData: ResourceConsumptionManager.UsesConsumerData;
        itemUsesData: ResourceConsumptionManager.UsesConsumerData;
    };

    let {
        consumers,
        selectedConsumers,
        actionUsesData = $bindable(),
        itemUsesData = $bindable(),
    }: Props = $props();

    let actor: Actor = getContext("actor");
    let item: Item = getContext("item");
    let actionId: string = getContext("actionId");
    let action = $derived(item.reactive.actions.get(actionId)!);

    let parts = $state(
        ResourceConsumptionManager.prepareUsesData(
            actor,
            item,
            consumers,
            actionId,
        ),
    );

    // =======================================================
    // Consumer data
    actionUsesData = parts.actionUsesData;
    itemUsesData = parts.itemUsesData;

    let actionUses = $derived(parts.actionUses);
    let actionMaxUses = $derived(parts.actionMaxUses);
    let itemUses = $derived(parts.itemUses);
    let itemMaxUses = $derived(parts.itemMaxUses);
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
