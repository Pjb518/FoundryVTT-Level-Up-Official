<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import {
        TJSMenu,
        TJSToggleIconButton,
    } from "@typhonjs-fvtt/svelte-standard/component";

    import ActionsAddMenu from "../ActionsAddMenu.svelte";
    import ConsumerConfigWrapper from "../itemActionsConfig/ConsumerConfigWrapper.svelte";
    import QuantityConsumer from "../itemActionsConfig/QuantityConsumer.svelte";
    import UsesConsumer from "../itemActionsConfig/UsesConsumer.svelte";
    import AmmoConsumer from "../itemActionsConfig/AmmoConsumer.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    function addConsumer(type) {
        const consumerData = { type };

        if (type === "quantity") {
            consumerData["itemId"] = "";
            consumerData["quantity"] = 1;
        }

        if (type === "ammunition") {
            consumerData["itemId"] = "";
            consumerData["quantity"] = 1;
        }

        $item.update({
            [`system.actions.${actionId}.consumers`]: {
                ...action.consumers,
                [foundry.utils.randomID()]: consumerData,
            },
        });
    }

    const consumerTypes = {
        ammunition: {
            heading: "A5E.ConsumerAmmunition",
            singleLabel: "A5E.ObjectTypeAmmunition",
            component: AmmoConsumer,
        },
        quantity: {
            heading: "A5E.ConsumerQuantity",
            singleLabel: "A5E.ItemQuantity",
            component: QuantityConsumer,
        },
        actionUses: {
            heading: "A5E.ConsumerUsesAction",
            singleLabel: "A5E.ConsumerUsesAction",
            component: UsesConsumer,
        },
        itemUses: {
            heading: "A5E.ConsumerUsesItem",
            singleLabel: "A5E.ConsumerUsesItem",
            component: UsesConsumer,
        },
    };

    $: action = $item.actions[actionId];
    $: consumers = action.consumers ?? {};
    $: actionUsesConsumers = Object.values(consumers).filter(
        (c) => c.type === "actionUses"
    );
    $: itemUsesConsumers = Object.values(consumers).filter(
        (c) => c.type === "itemUses"
    );

    $: menuItems = Object.entries(consumerTypes).reduce(
        (acc, [consumerType, { singleLabel }]) => {
            if (consumerType === "itemUses" && itemUsesConsumers.length)
                return acc;
            if (consumerType === "actionUses" && actionUsesConsumers.length)
                return acc;

            acc.push([singleLabel, consumerType]);
            return acc;
        },
        []
    );
</script>

<article>
    <ul class="consumers-config-list">
        {#each Object.entries(consumerTypes) as [consumerType, { heading, singleLabel, component }] (consumerType)}
            {#if Object.values(consumers).filter((consumer) => consumer.type === consumerType).length}
                <li class="consumers-config-list__item">
                    <header class="action-config__section-header">
                        <h2 class="action-config__section-header">
                            {localize(heading)}
                        </h2>

                        {#if !["actionUses", "itemUses"].includes(consumerType)}
                            <button
                                class="add-button"
                                on:click={() => addConsumer(consumerType)}
                            >
                                {localize("A5E.ButtonAddConsumer", {
                                    type: localize(singleLabel),
                                })}
                            </button>
                        {/if}
                    </header>

                    <ul class="consumers-list">
                        {#each Object.entries(consumers).filter(([_, consumer]) => consumer.type === consumerType) as [consumerId, consumer] (consumerId)}
                            <ConsumerConfigWrapper {consumer} {consumerId}>
                                <svelte:component
                                    this={component}
                                    {consumer}
                                    {consumerId}
                                />
                            </ConsumerConfigWrapper>
                        {:else}
                            <li class="action-config__none">
                                {localize("A5E.None")}
                            </li>
                        {/each}
                    </ul>
                </li>
            {/if}
        {/each}
    </ul>

    <div class="sticky-add-button">
        <TJSToggleIconButton title="A5E.ButtonAddRoll" icon="fas fa-plus">
            <TJSMenu offset={{ x: -110, y: -140 }}>
                <ActionsAddMenu
                    menuList={menuItems}
                    on:press={({ detail }) => addConsumer(detail)}
                />
            </TJSMenu>
        </TJSToggleIconButton>
    </div>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.75rem;
        overflow: hidden;
    }

    .consumers-list {
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        list-style: none;
    }

    .consumers-config-list {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 0.75rem;
        list-style: none;
        padding: 0;
        margin: 0;
        overflow-y: auto;

        &__item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    }

    .sticky-add-button {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
</style>
