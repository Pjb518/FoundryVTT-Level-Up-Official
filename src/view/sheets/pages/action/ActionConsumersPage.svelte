<script lang="ts">
    import type { Action } from "#types/action.d.ts";
    import type { ActionComponentType } from "#view/sheets/components/action/data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";
    import { formulaIsClassResource } from "#utils/formulaIsClassResource.ts";
    import handleDeterministicInput from "#utils/handleDeterministicInput.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField";

    import { ActionsManager } from "#managers/ActionsManager.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    import AmmoConsumer from "#view/sheets/components/action/AmmoConsumer.svelte";
    import HitDiceConsumer from "#view/sheets/components/action/HitDiceConsumer.svelte";
    import QualityConsumer from "#view/sheets/components/action/QualityConsumer.svelte";
    import QuantityConsumer from "#view/sheets/components/action/QuantityConsumer.svelte";
    import ResourceConsumer from "#view/sheets/components/action/ResourceConsumer.svelte";
    import SpellConsumer from "#view/sheets/components/action/SpellConsumer.svelte";
    import UsesConsumer from "../../../../apps/components/itemActionsConfig/UsesConsumer.svelte";

    async function deleteConsumer(actionId: string, consumerId: string) {
        item.update({
            [`system.actions.${actionId}.consumers`]: {
                [`-=${consumerId}`]: null,
            },
        });
    }

    function duplicateConsumer(actionId: string, consumer: Record<string, any>) {
        const newConsumer = foundry.utils.duplicate(consumer);

        item.update({
            [`system.actions.${actionId}.consumers`]: {
                [foundry.utils.randomID()]: newConsumer,
            },
        });
    }

    let item: any = getContext("item");
    let actionId: string = getContext("actionId");

    const consumerTypes: Record<string, ActionComponentType> = {
        ammunition: {
            heading: "A5E.consumers.ammunition",
            singleLabel: "A5E.objects.types.singular.ammunition",
            component: AmmoConsumer,
        },
        hitDice: {
            heading: "A5E.consumers.hitDice",
            singleLabel: "A5E.hitDice.title",
            component: HitDiceConsumer,
        },
        quality: {
            heading: "A5E.consumers.quality",
            singleLabel: "A5E.ItemQuality",
            component: QualityConsumer,
        },
        quantity: {
            heading: "A5E.consumers.quantity",
            singleLabel: "A5E.ItemQuantity",
            component: QuantityConsumer,
        },
        resource: {
            heading: "A5E.consumers.resources.consumer",
            singleLabel: "A5E.consumers.resources.title",
            component: ResourceConsumer,
        },
        spell: {
            heading: "A5E.consumers.spell",
            singleLabel: "A5E.spells.title",
            component: SpellConsumer,
        },
        actionUses: {
            heading: "A5E.consumers.uses.action",
            singleLabel: "A5E.consumers.actionUses",
            component: UsesConsumer,
        },
        itemUses: {
            heading: "A5E.consumers.uses.item",
            singleLabel: "A5E.consumers.itemUses",
            component: UsesConsumer,
        },
    };

    const { A5E } = CONFIG;

    let action = $derived(item.reactive.actions.get(actionId));
    let consumers: [string, any][] = $derived(Object.entries(action.consumers ?? {}));

    let isClassResource = formulaIsClassResource(action.uses?.max ?? "");

    $inspect(action.consumers);
</script>

{#snippet ConsumerListItem(consumerType: string, consumerConfig: ActionComponentType)}
    <Section
        heading={consumerConfig.heading}
        headerButtons={[
            {
                classes: "add-button",
                handler: () =>
                    ActionsManager.addConsumer(item, [actionId, action], consumerType),
                label: localize("A5E.buttons.addConsumer", {
                    type: localize(
                        consumerConfig.buttonLabel ?? consumerConfig.singleLabel,
                    ),
                }),
            },
        ]}
        --a5e-section-gap="0"
    >
        <ul class="a5e-item-list">
            {#each consumers.filter(([, consumer]) => consumer.type === consumerType) as [consumerId, consumer] (consumerId)}
                <li class="a5e-item a5e-item--action-config">
                    <consumerConfig.component
                        {deleteConsumer}
                        {duplicateConsumer}
                        {consumer}
                        {consumerId}
                    />
                </li>
            {/each}
        </ul>
    </Section>
{/snippet}

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <!-- Action Resources Section -->
    <Section
        heading="A5E.consumers.uses.title"
        --a5e-section-body-direction="row"
        --a5e-section-body-gap="0.5rem"
    >
        {#if !isClassResource}
            <FieldWrapper
                heading="A5E.consumers.uses.current"
                --a5e-field-wrapper-width="7.5rem"
            >
                <input
                    class="a5e-input a5e-input--slim"
                    type="number"
                    name="system.actions.{actionId}.uses.value"
                    value={action.uses?.value ?? 0}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            currentTarget.name,
                            Number(currentTarget.value),
                        )}
                />
            </FieldWrapper>
        {/if}

        <FieldWrapper heading="A5E.consumers.uses.max" --a5e-field-wrapper-width="7.5rem">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                name="system.actions.{actionId}.uses.max"
                value={action.uses?.max ?? ""}
                onchange={({ currentTarget }) => {
                    handleDeterministicInput(currentTarget.value);
                    updateDocumentDataFromField(
                        item,
                        currentTarget.name,
                        currentTarget.value,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper heading="A5E.consumers.uses.per">
            <select
                class="a5e-input a5e-input--slim a5e-input--fit"
                name="system.actions.{actionId}.uses.per"
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        currentTarget.name,
                        currentTarget.value,
                    )}
            >
                <option value=""></option>

                {#each Object.entries(A5E.resourceRecoveryOptions) as [key, name]}
                    <option value={key} selected={action.uses?.per === key}>
                        {localize(name as string)}
                    </option>
                {/each}
            </select>
        </FieldWrapper>
    </Section>

    {#if action.uses?.per === "recharge"}
        <Section
            heading="A5E.actions.headings.recharge.configuration"
            --a5e-section-body-direction="row"
            --a5e-section-body-gap="0.5rem"
        >
            <FieldWrapper
                heading="A5E.actions.headings.recharge.formula"
                --a5e-field-wrapper-grow="1"
            >
                <input
                    class="a5e-input a5e-input--slim"
                    id="{actionId}-recharge-formula"
                    type="text"
                    value={action.uses?.recharge?.formula ?? "1d6"}
                    placeholder="1d6"
                    onchange={({ currentTarget }) => {
                        handleDeterministicInput(currentTarget.value);
                        updateDocumentDataFromField(
                            item,
                            `system.actions.${actionId}.uses.recharge.formula`,
                            currentTarget.value,
                        );
                    }}
                />
            </FieldWrapper>

            <FieldWrapper heading="A5E.actions.headings.recharge.threshold">
                <input
                    class="a5e-input a5e-input--slim"
                    id="{actionId}-recharge-threshold"
                    type="number"
                    value={action.uses?.recharge?.threshold ?? 6}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            `system.actions.${actionId}.uses.recharge.threshold`,
                            Number(currentTarget.value),
                        )}
                />
            </FieldWrapper>
        </Section>
    {/if}

    <ul class="a5e-action-config__list">
        {#each Object.entries(consumerTypes) as [consumerType, consumerConfig] (consumerType)}
            <!-- {#if consumers.filter(([, consumer]) => consumer.type === consumerType).length} -->
            <li class="a5e-action-config__list-item">
                {@render ConsumerListItem(consumerType, consumerConfig)}
            </li>
            <!-- {/if} -->
        {/each}
    </ul>
</div>
