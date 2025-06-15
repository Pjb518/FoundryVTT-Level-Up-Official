<script lang="ts">
    import type { ActionActivationOptions } from "../../../documents/item/data.ts";
    import type { AttackRollData } from "../../../dataModels/item/actions/ActionRollsDataModel.ts";

    import { ResourceConsumptionManager } from "#managers/ResourceConsumptionManager.ts";
    import { RollPreparationManager } from "#managers/RollPreparationManager.ts";

    import { setContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import showActivationDialogSection from "#utils/showActivationDialogSection.ts";
    import validateTemplateData from "#utils/measuredTemplates/validateTemplateData.ts";

    import ConsumptionValidator from "#utils/validators/ConsumptionValidator.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    import AttackRollSection from "#view/components/activationDialog/AttackRollSection.svelte";
    import HitDiceSection from "#view/components/activationDialog/HitDiceSection.svelte";
    import OutputVisibilitySection from "#view/components/OutputVisibilitySection.svelte";
    import PromptsSection from "#view/components/activationDialog/PromptsSection.svelte";
    import RollsSection from "#view/components/activationDialog/RollsSection.svelte";
    import SpellSection from "#view/components/activationDialog/SpellSection.svelte";
    import UsesSection from "#view/components/activationDialog/UsesSection.svelte";

    type Props = {
        actionId: string;
        options: ActionActivationOptions;
        dialog: any;
        actorDocument: any;
        itemDocument: any;
    };

    function onSubmit() {
        console.log(attackRollData);

        dialog.submit({
            attack: attackRollData,
            consumers: {
                actionUses: actionUsesData,
                hitDice: hitDiceData,
                itemUses: itemUsesData,
                spell: spellData,
            },
            damageBonuses: RollPreparationManager.getSelectedBonuses(
                actor,
                "damage",
                selectedDamageBonuses,
            ),
            effects: selectedEffects,
            healingBonuses: RollPreparationManager.getSelectedBonuses(
                actor,
                "healing",
                selectedHealingBonuses,
            ),
            prompts: RollPreparationManager.getSelectedPrompts(
                actor,
                item,
                actionId,
                selectedPrompts,
            ),
            rolls: RollPreparationManager.getSelectedRolls(
                item,
                actionId,
                selectedRolls,
            ),
            selectedConsumers,
            placeTemplate,
            visibilityMode,
        });
    }

    let { actionId, options, dialog, actorDocument, itemDocument }: Props =
        $props();

    let actor = actorDocument;
    let item = itemDocument;

    let action = $derived(item.reactive.actions.get(actionId)!);
    let { BonusesManager } = actor;
    const { isEmpty } = foundry.utils;

    const consumers = RollPreparationManager.prepareConsumers(item, actionId);
    const effects = RollPreparationManager.prepareEffects(item, actionId);
    const prompts = RollPreparationManager.preparePrompts(item, actionId);
    const rolls = RollPreparationManager.prepareRolls(item, actionId);
    const damageBonuses = BonusesManager.prepareGlobalDamageBonuses(
        item,
        rolls,
    );
    const healingBonuses = BonusesManager.prepareGlobalHealingBonuses(
        item,
        rolls,
    );

    const attackRoll = rolls.attack?.length
        ? rolls.attack[0][1]
        : ({} as AttackRollData);

    const consumerOptions = Object.entries(consumers ?? {}).reduce(
        (acc, [type, data]) => {
            if (type === "resource") {
                data.forEach((e, idx) =>
                    acc.push([
                        e[0],
                        e[1].label || `Resource Consumer #${idx + 1}`,
                    ]),
                );
            } else {
                acc.push([
                    data[0],
                    data[1].label || `${type.capitalize()} Consumer `,
                ]);
            }

            return acc;
        },
        [] as any[],
    );

    let selectedConsumers = $state(
        ResourceConsumptionManager.getDefaultConsumerSelection(consumers),
    );

    // Show Config
    let showAttackRoll = $state(!isEmpty(attackRoll));
    let showOtherRolls = $state(!!Object.values(rolls).flat().length);
    let showDamageBonuses = $state(
        !!Object.values(damageBonuses).flat().length,
    );
    let showHealingBonuses = $state(
        !!Object.values(healingBonuses).flat().length,
    );
    let showBonusesSection = $state(showDamageBonuses || showHealingBonuses);
    let showPrompts = $state(!!Object.values(prompts).flat().length);

    let showSpellSection = $derived(
        showActivationDialogSection(
            action,
            selectedConsumers,
            ["spell"],
            ["spellLevel", "spellPoints"],
        ),
    );

    let showUsesSection = $derived(
        showActivationDialogSection(
            action,
            selectedConsumers,
            ["actionUses", "itemUses"],
            ["actionUses", "itemUses"],
        ),
    );

    let showHitDiceSection = $derived(
        !!Object.values(consumers.hitDice ?? {}).flat().length &&
            selectedConsumers.includes(consumers?.hitDice?.[0]!),
    );

    let showConsumersSection = $derived(
        Object.values(consumers ?? {}).flat().length > 0,
    );

    let attackRollData = $state({});
    let actionUsesData = $state(
        {} as ResourceConsumptionManager.UsesConsumerData,
    );
    let hitDiceData = $state(
        {} as ResourceConsumptionManager.HitDiceConsumerData,
    );
    let itemUsesData = $state(
        {} as ResourceConsumptionManager.UsesConsumerData,
    );
    let spellData = $state({} as ResourceConsumptionManager.SpellConsumerData);
    let selectedDamageBonuses = $state(
        BonusesManager.getDefaultSelectionsFromBonuses({
            damageBonuses,
        }),
    );
    let selectedHealingBonuses = $state(
        BonusesManager.getDefaultSelectionsFromBonuses({
            healingBonuses,
        }),
    );
    let selectedPrompts = $state(
        BonusesManager.getDefaultSelectionsFromBonuses(prompts),
    );
    let selectedRolls = $state(
        BonusesManager.getDefaultSelectionsFromBonuses(rolls),
    );
    let selectedEffects = $state(
        RollPreparationManager.getDefaultSelectedEffects(effects),
    );

    let visibilityMode = $state(game.settings?.get("core", "rollMode")!);

    let placeTemplate = $state(
        (game.settings.get("a5e", "placeItemTemplateDefault") as boolean) ||
            (action?.area?.placeTemplate as boolean) ||
            false,
    );

    const isValidTemplate = validateTemplateData(action.area);

    // Validator
    const validator = new ConsumptionValidator(actor, item, action, consumers);

    const preventActionRollOnWarning =
        (game.settings?.get("a5e", "preventActionRollOnWarning") as boolean) ??
        false;

    let consumerData = $derived({
        actionUses: actionUsesData,
        hitDice: hitDiceData,
        itemUses: itemUsesData,
    });

    let warnings = $derived(
        validator.validateData(consumerData, selectedConsumers),
    );

    setContext("actionId", actionId);
    setContext("actor", actor);
    setContext("dialog", dialog);
    setContext("item", item);
</script>

<form>
    {#if warnings.length}
        <section class="warning__wrapper">
            {#each warnings as warning}
                <p class="warning" style="color: var(--a5e-color-warning);">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    {warning}
                </p>
            {/each}
        </section>
    {/if}

    <Section --a5e-section-body-gap="0.5rem">
        <OutputVisibilitySection bind:visibilityMode />
    </Section>

    {#if showAttackRoll}
        <Section heading="Attack Roll Config" --a5e-section-body-gap="0.5rem">
            <AttackRollSection {attackRoll} {options} bind:attackRollData />
        </Section>
    {/if}

    {#if showOtherRolls}
        <Section heading="Rolls Config" --a5e-section-body-gap="0.5rem">
            <RollsSection {rolls} bind:selectedRolls />
        </Section>
    {/if}

    {#if showBonusesSection}
        <Section heading="Bonuses Config" --a5e-section-body-gap="0.5rem">
            {#if showDamageBonuses}
                <CheckboxGroup
                    heading="Damage Bonuses"
                    options={damageBonuses.map(([key, damageBonus]) => [
                        key,
                        damageBonus.label || damageBonus.defaultLabel || "",
                    ])}
                    selected={selectedDamageBonuses}
                    on:updateSelection={({ detail }) =>
                        (selectedDamageBonuses = detail)}
                />
            {/if}

            {#if showHealingBonuses}
                <CheckboxGroup
                    heading="Healing Bonuses"
                    options={healingBonuses.map(([key, healingBonus]) => [
                        key,
                        healingBonus.label || healingBonus.defaultLabel || "",
                    ])}
                    selected={selectedHealingBonuses}
                    on:updateSelection={({ detail }) =>
                        (selectedHealingBonuses = detail)}
                />
            {/if}
        </Section>
    {/if}

    {#if showPrompts}
        <Section heading="Prompts Config" --a5e-section-body-gap="0.5rem">
            <PromptsSection {prompts} bind:selectedPrompts />
        </Section>
    {/if}

    {#if showConsumersSection}
        <Section heading="Consumers Config" --a5e-section-body-gap="0.5rem">
            <FieldWrapper
                hint="These consumers are the only ones that will apply when the item is rolled."
            >
                <CheckboxGroup
                    heading="Selected Consumers to apply on roll"
                    options={consumerOptions}
                    selected={selectedConsumers}
                    on:updateSelection={({ detail }) =>
                        (selectedConsumers = detail)}
                />
            </FieldWrapper>

            {#if showSpellSection}
                <SpellSection {consumers} bind:spellData />
            {/if}

            {#if showUsesSection}
                <UsesSection
                    {consumers}
                    {selectedConsumers}
                    bind:actionUsesData
                    bind:itemUsesData
                />
            {/if}

            {#if showHitDiceSection}
                <HitDiceSection {consumers} bind:hitDiceData />
            {/if}
        </Section>
    {/if}

    <!-- Template Placement -->
    {#if isValidTemplate}
        <Section heading="Template Config" --a5e-section-body-gap="0.5rem">
            <Checkbox
                label="A5E.actions.labels.placeTemplate"
                checked={placeTemplate}
                on:updateSelection={({ detail }) => (placeTemplate = detail)}
            />
        </Section>
    {/if}

    {#if effects.length}
        <Section heading="Effects Config" --a5e-section-body-gap="0.5rem">
            <CheckboxGroup
                options={effects.map((e) => [e.id, e.name])}
                selected={selectedEffects}
                hint="Select which effects to activate/display on chat card"
                on:updateSelection={({ detail }) => (selectedEffects = detail)}
            />
        </Section>
    {/if}

    <Section>
        <button
            type="submit"
            disabled={preventActionRollOnWarning && !!warnings.length}
            on:click|preventDefault={onSubmit}
        >
            {#if warnings.length}
                <i
                    class="icon fa-solid fa-circle-exclamation"
                    style="color: var(--a5e-color-warning);"
                />
            {:else}
                <i class="icon fa-solid fa-dice" />
            {/if}
            {localize("A5E.actions.labels.dialogSubmitRoll")}
        </button>
    </Section>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem;
        max-height: 50rem;
        overflow-y: auto;
    }

    :global(small) {
        margin-top: 0.25rem;
    }

    .warning__wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-block: 0.125rem;
        padding-inline: 0.25rem;

        .warning {
            font-family: --a5e-font-sans-serif;
            font-size: var(--a5e-text-size-xs);
        }
    }
</style>
