<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import ActionsManager from "../../../managers/ActionsManager";

    import AmmoConsumer from "../itemActionsConfig/AmmoConsumer.svelte";
    import ConsumerConfigWrapper from "../itemActionsConfig/ConsumerConfigWrapper.svelte";
    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import HitDiceConsumer from "../itemActionsConfig/HitDiceConsumer.svelte";
    import QuantityConsumer from "../itemActionsConfig/QuantityConsumer.svelte";
    import ResourceConsumer from "../itemActionsConfig/ResourceConsumer.svelte";
    import SpellConsumer from "../itemActionsConfig/SpellConsumer.svelte";
    import UsesConsumer from "../itemActionsConfig/UsesConsumer.svelte";

    import FormSection from "../FormSection.svelte";

    import handleDeterministicInput from "../../../utils/handleDeterministicInput";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const actionId = getContext("actionId");
    const { A5E } = CONFIG;

    const consumerTypes = {
        ammunition: {
            heading: "A5E.ConsumerAmmunition",
            singleLabel: "A5E.ObjectTypeAmmunition",
            component: AmmoConsumer,
        },
        hitDice: {
            heading: "A5E.ConsumerHitDice",
            singleLabel: "A5E.HitDiceLabel",
            component: HitDiceConsumer,
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
    };

    $: action = $item.actions[actionId];
    $: consumers = action.consumers ?? {};
    $: existingConsumers = new Set(Object.values(consumers).map((c) => c.type));

    $: menuList = Object.entries(consumerTypes).reduce(
        (acc, [consumerType, { singleLabel }]) => {
            if (
                consumerType === "resource" ||
                !existingConsumers.has(consumerType)
            )
                acc.push([consumerType, singleLabel]);

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

            {#if action.uses?.per === "recharge"}
                <FormSection heading="A5E.ItemRechargeConfiguration">
                    <div class="u-flex u-gap-md u-w-full">
                        <div class="recharge-formula">
                            <label
                                class="recharge-formula__label"
                                for="{actionId}-recharge-formula"
                            >
                                {localize("A5E.ItemRechargeFormula")}
                            </label>

                            <input
                                id="{actionId}-recharge-formula"
                                type="text"
                                value={action.uses?.recharge?.formula ?? "1d6"}
                                placeholder="1d6"
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

                        <div class="recharge-threshold">
                            <label
                                class="recharge-threshold__label"
                                for="{actionId}-recharge-threshold"
                            >
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
        <CreateMenu
            {menuList}
            offset={{ x: -110, y: -130 }}
            documentName="Consumer"
            on:press={({ detail }) =>
                ActionsManager.addConsumer($item, [actionId, action], detail)}
        />
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
        color: #999;
    }

    .recharge-formula,
    .recharge-threshold {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        white-space: nowrap;
        font-size: 0.833rem;

        &__label {
            display: block;
            padding-right: 0.75rem;
        }
    }

    .recharge-threshold {
        width: fit-content;
        flex-shrink: 0;
    }

    .recharge-formula {
        width: 100%;
    }
</style>
