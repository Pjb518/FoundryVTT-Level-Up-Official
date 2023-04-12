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
    import UsesConsumer from "../itemActionsConfig/UsesConsumer.svelte";

    import FormSection from "../FormSection.svelte";

    import handleDeterministicInput from "../../utils/handleDeterministicInput";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const actionId = getContext("actionId");
    const { A5E } = CONFIG;

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

        if (type === "uses") {
            data["consumeType"] = "item";
            data["default"] = 1;
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
        uses: {
            heading: "A5E.ConsumerUses",
            singleLabel: "A5E.ConsumerUses",
            component: UsesConsumer,
        },
    };

    $: action = $item.actions[actionId];
    $: consumers = action.consumers ?? {};
    $: ammunitionConsumers = Object.values(consumers ?? {}).filter(
        (c) => c.type === "ammunition"
    );
    $: quantityConsumers = Object.values(consumers ?? {}).filter(
        (c) => c.type === "quantity"
    );
    $: spellConsumers = Object.entries(consumers ?? {}).filter(
        (c) => c.type === "spell"
    );
    $: usesConsumers = Object.entries(consumers ?? {}).filter(
        (c) => c.type === "uses"
    );

    $: menuItems = Object.entries(consumerTypes).reduce(
        (acc, [consumerType, { singleLabel }]) => {
            if (consumerType === "ammunition" && ammunitionConsumers.length)
                return acc;
            if (consumerType === "quantity" && quantityConsumers.length)
                return acc;
            if (consumerType === "spell" && spellConsumers.length) return acc;
            if (consumerType === "uses" && usesConsumers.length) return acc;

            acc.push([singleLabel, consumerType]);
            return acc;
        },
        []
    );
</script>

<article>
    <div class="main-container">
        <!-- Action Resources Section -->
        <div class="u-flex u-flex-col u-gap-md u-mb-lg">
            <FormSection heading="A5E.Uses">
                <div class="u-flex u-gap-lg u-w-full">
                    <div class="u-flex u-flex-col u-gap-xs u-w-30">
                        <h3 class="u-text-sm">{localize("A5E.UsesCurrent")}</h3>

                        <input
                            type="number"
                            d-type="Number"
                            name="system.actions.{actionId}.uses.value"
                            value={action.uses?.value ?? 0}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    Number(target.value)
                                )}
                        />
                    </div>

                    <div class="u-flex u-flex-col u-gap-xs u-w-30">
                        <h3 class="u-text-sm">{localize("A5E.UsesMax")}</h3>

                        <input
                            type="text"
                            name="system.actions.{actionId}.uses.max"
                            value={action.uses?.max ?? ""}
                            on:change={({ target }) => {
                                handleDeterministicInput(target.value);
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.value
                                );
                            }}
                        />
                    </div>

                    <div class="u-flex u-flex-col u-gap-xs u-w-fit">
                        <h3 class="u-text-sm">{localize("A5E.UsesPer")}</h3>
                        <select
                            class="u-w-40"
                            name="system.actions.{actionId}.uses.per"
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.value
                                )}
                        >
                            <option value="" />

                            {#each Object.entries(A5E.resourceRecoveryOptions) as [key, name]}
                                <option
                                    {key}
                                    value={key}
                                    selected={action.uses?.per === key}
                                >
                                    {localize(name)}
                                </option>
                            {/each}
                        </select>
                    </div>
                </div>
            </FormSection>

            <!-- {action.uses?.per} -->
            {#if action.uses?.per === "recharge"}
                <FormSection heading="A5E.ItemRechargeConfiguration">
                    <div class="u-flex u-gap-md u-w-full">
                        <div class="u-flex u-flex-col u-gap-md u-w-full">
                            <label for="{actionId}-recharge-formula">
                                {localize("A5E.ItemRechargeFormula")}
                            </label>

                            <input
                                id="{actionId}-recharge-formula"
                                type="text"
                                value={action.uses?.recharge?.formula ?? "1d6"}
                                on:change={({ target }) => {
                                    handleDeterministicInput(target.value);
                                    updateDocumentDataFromField(
                                        $item,
                                        `system.actions.${actionId}.uses.recharge.formula`,
                                        target.value
                                    );
                                }}
                            />
                        </div>

                        <div class="u-flex u-flex-col u-gap-md u-w-fit">
                            <label for="{actionId}-recharge-threshold">
                                {localize("A5E.ItemRechargeThreshold")}
                            </label>

                            <input
                                id="{actionId}-recharge-threshold"
                                class="u-text-center"
                                type="number"
                                value={action.uses?.recharge?.threshold ?? 6}
                                on:change={({ target }) =>
                                    updateDocumentDataFromField(
                                        $item,
                                        `system.actions.${actionId}.uses.recharge.threshold`,
                                        Number(target.value)
                                    )}
                            />
                        </div>
                    </div>
                </FormSection>
            {/if}
        </div>
        <!-- Consumers Section -->
        <ul class="consumers-config-list">
            {#each Object.entries(consumerTypes) as [consumerType, { heading, component }] (consumerType)}
                {#if Object.values(consumers).filter((consumer) => consumer.type === consumerType).length}
                    <li class="consumers-config-list__item">
                        <header class="action-config__section-header">
                            <h2 class="action-config__section-header">
                                {localize(heading)}
                            </h2>
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
    </div>
    <div class="sticky-add-button">
        <TJSToggleIconButton title="A5E.ButtonAddRoll" icon="fas fa-plus">
            <TJSMenu offset={{ x: -110, y: -105 }}>
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

    .main-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        flex-grow: 1;
        overflow: auto;
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
        gap: 0.75rem;
        list-style: none;
        padding: 0;
        margin: 0;

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
