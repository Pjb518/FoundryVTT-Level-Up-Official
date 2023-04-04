<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import {
        TJSMenu,
        TJSToggleIconButton,
    } from "@typhonjs-fvtt/svelte-standard/component";

    import AddMenu from "../AddMenu.svelte";
    import AmmoConsumer from "../itemActionsConfig/AmmoConsumer.svelte";
    import ConsumerConfigWrapper from "../itemActionsConfig/ConsumerConfigWrapper.svelte";
    import QuantityConsumer from "../itemActionsConfig/QuantityConsumer.svelte";
    import ResourceConsumer from "../itemActionsConfig/ResourceConsumer.svelte";
    import SpellConsumer from "../itemActionsConfig/SpellConsumer.svelte";
    import RechargeConsumer from "../itemActionsConfig/RechargeConsumer.svelte";
    import UsesConsumer from "../itemActionsConfig/UsesConsumer.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    function addConsumer(type) {
        const data = { type };

        if (type === "ammunition") {
            data["itemId"] = "";
            data["quantity"] = 1;
        }

        if (type === "quantity") {
            data["itemId"] = "";
            data["quantity"] = 1;
        }

        if (type === "resource") {
            data["resource"] = "";
            data["quantity"] = 1;
        }

        if (type === "spell") {
            data["mode"] = "variable";
            data["spellLevel"] = $item.system.level ?? 1;
            data["points"] =
                CONFIG.A5E.spellLevelCost?.[$item.system.level] ?? 1;
        }

        if (type === "recharge") {
            data["charged"] = true;
            data["consumeType"] = "item";
        }

        $item.update({
            [`system.actions.${actionId}.consumers`]: {
                ...action.consumers,
                [foundry.utils.randomID()]: data,
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
        resource: {
            heading: "A5E.ConsumerResource",
            singleLabel: "A5E.Resource",
            component: ResourceConsumer,
        },
        spell: {
            heading: "A5E.ConsumerSpell",
            singleLabel: "A5E.Spell",
            component: SpellConsumer,
        },
        actionUses: {
            heading: "A5E.ConsumerUsesAction",
            singleLabel: "A5E.ConsumerActionUses",
            component: UsesConsumer,
        },
        itemUses: {
            heading: "A5E.ConsumerUsesItem",
            singleLabel: "A5E.ConsumerItemUses",
            component: UsesConsumer,
        },
        recharge: {
            heading: "A5E.ConsumerCharges",
            singleLabel: "A5E.Charge",
            component: RechargeConsumer,
        },
    };

    $: action = $item.actions[actionId];
    $: consumers = action.consumers ?? {};
    $: actionUsesConsumers = Object.values(consumers ?? {}).filter(
        (c) => c.type === "actionUses"
    );
    $: ammunitionConsumers = Object.values(consumers ?? {}).filter(
        (c) => c.type === "ammunition"
    );
    $: itemUsesConsumers = Object.values(consumers ?? {}).filter(
        (c) => c.type === "itemUses"
    );
    $: quantityConsumers = Object.values(consumers ?? {}).filter(
        (c) => c.type === "quantity"
    );
    $: spellConsumers = Object.entries(consumers ?? {}).filter(
        (c) => c.type === "spell"
    );

    $: menuItems = Object.entries(consumerTypes).reduce(
        (acc, [consumerType, { singleLabel }]) => {
            if (consumerType === "itemUses" && itemUsesConsumers.length)
                return acc;
            if (consumerType === "actionUses" && actionUsesConsumers.length)
                return acc;
            if (consumerType === "ammunition" && ammunitionConsumers.length)
                return acc;
            if (consumerType === "quantity" && quantityConsumers.length)
                return acc;
            if (consumerType === "spell" && spellConsumers.length) return acc;

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

                        {#if false}
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
                <AddMenu
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
