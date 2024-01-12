<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import ActionsManager from "../../../managers/ActionsManager";

    import AmmoConsumer from "../itemActionsConfig/AmmoConsumer.svelte";
    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import HitDiceConsumer from "../itemActionsConfig/HitDiceConsumer.svelte";
    import QuantityConsumer from "../itemActionsConfig/QuantityConsumer.svelte";
    import ResourceConsumer from "../itemActionsConfig/ResourceConsumer.svelte";
    import SpellConsumer from "../itemActionsConfig/SpellConsumer.svelte";
    import UsesConsumer from "../itemActionsConfig/UsesConsumer.svelte";

    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    import handleDeterministicInput from "../../../utils/handleDeterministicInput";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    function deleteConsumer(actionId, consumerId) {
        $item.update({
            [`system.actions.${actionId}.consumers`]: {
                [`-=${consumerId}`]: null,
            },
        });
    }

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
        [],
    );
</script>

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <!-- Action Resources Section -->
    <Section
        heading="A5E.Uses"
        --a5e-section-body-direction="row"
        --a5e-section-body-gap="0.5rem"
    >
        <FieldWrapper
            heading="A5E.UsesCurrent"
            --a5e-field-wrapper-width="7.5rem"
        >
            <input
                type="number"
                d-type="Number"
                name="system.actions.{actionId}.uses.value"
                value={action.uses?.value ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        Number(target.value),
                    )}
            />
        </FieldWrapper>

        <FieldWrapper heading="A5E.UsesMax" --a5e-field-wrapper-width="7.5rem">
            <input
                type="text"
                name="system.actions.{actionId}.uses.max"
                value={action.uses?.max ?? ""}
                on:change={({ target }) => {
                    handleDeterministicInput(target.value);
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        target.value,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper heading="A5E.UsesPer">
            <select
                class="u-w-40"
                name="system.actions.{actionId}.uses.per"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        target.value,
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
        </FieldWrapper>
    </Section>

    {#if action.uses?.per === "recharge"}
        <Section
            heading="A5E.ItemRechargeConfiguration"
            --a5e-section-body-direction="row"
            --a5e-section-body-gap="0.5rem"
        >
            <FieldWrapper
                heading="A5E.ItemRechargeFormula"
                --a5e-field-wrapper-grow="1"
            >
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
                            target.value,
                        );
                    }}
                />
            </FieldWrapper>

            <FieldWrapper heading="A5E.ItemRechargeThreshold">
                <input
                    id="{actionId}-recharge-threshold"
                    class="u-text-center"
                    type="number"
                    value={action.uses?.recharge?.threshold ?? 6}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.uses.recharge.threshold`,
                            Number(target.value),
                        )}
                />
            </FieldWrapper>
        </Section>
    {/if}
    <!-- Consumers Section -->
    <ul class="consumers-config-list">
        {#each Object.entries(consumerTypes) as [consumerType, { heading, component }] (consumerType)}
            {#if Object.values(consumers).filter((consumer) => consumer.type === consumerType).length}
                <li class="consumers-config-list__item">
                    <Section {heading} --a5e-section-gap="0">
                        <ul class="a5e-item-list">
                            {#each Object.entries(consumers).filter(([_, consumer]) => consumer.type === consumerType) as [consumerId, consumer] (consumerId)}
                                <li class="a5e-item a5e-item--action-config">
                                    <svelte:component
                                        this={component}
                                        {consumer}
                                        {consumerId}
                                        {deleteConsumer}
                                    />
                                </li>
                            {/each}
                        </ul>
                    </Section>
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

<style lang="scss">
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
</style>
