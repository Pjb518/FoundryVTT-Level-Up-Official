<script lang="ts">
    import type { ActionActivationOptions } from "../../documents/item/data";
    import type { AttackRollData } from "../../dataModels/item/actions/ActionRollsDataModel";
    import type { BaseActorA5e } from "../../documents/actor/base";
    import type { ItemA5e } from "../../documents/item/item";
    import type { ResourceConsumptionManager } from "../../managers/ResourceConsumptionManager";

    import { RollPreparationManager } from "../../managers/RollPreparationManager";

    import { getContext, setContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import showActivationDialogSection from "../../utils/showActivationDialogSection";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import Section from "../components/Section.svelte";

    import AttackRollSection from "../components/activationDialog/AttackRollSection.svelte";
    import OutputVisibilitySection from "../components/activationDialog/OutputVisibilitySection.svelte";
    import PromptsSection from "../components/activationDialog/PromptsSection.svelte";
    import RollsSection from "../components/activationDialog/RollsSection.svelte";
    import SpellSection from "../components/activationDialog/SpellSection.svelte";
    import UsesSection from "../components/activationDialog/UsesSection.svelte";
    import HitDiceSection from "../components/activationDialog/HitDiceSection.svelte";
    import ConsumptionValidator from "../../utils/validators/ConsumptionValidator";

    export let { application } = getContext("#external") as { application: any };
    export let {
        actionId,
        options,
        dialog,
    }: { actionId: string; options: ActionActivationOptions; dialog: any } = application;
    export let {
        actorDocument,
        itemDocument,
    }: { actorDocument: BaseActorA5e; itemDocument: ItemA5e } = application;

    function onSubmit() {
        dialog.submit({
            attack: attackRollData,
            consumers: {
                actionUses: actionUsesData,
                hitDice: hitDiceData,
                itemUses: itemUsesData,
                spell: spellData,
            },
            damageBonuses: RollPreparationManager.getSelectedBonuses(
                $actor,
                "damage",
                selectedDamageBonuses,
            ),
            healingBonuses: RollPreparationManager.getSelectedBonuses(
                $actor,
                "healing",
                selectedHealingBonuses,
            ),
            prompts: RollPreparationManager.getSelectedPrompts(
                $actor,
                $item,
                actionId,
                selectedPrompts,
            ),
            rolls: RollPreparationManager.getSelectedRolls(
                $item,
                actionId,
                selectedRolls,
            ),
            visibilityMode,
        });
    }

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);
    const action = $item.actions.get(actionId)!;
    const { BonusesManager } = $actor;
    const { isEmpty } = foundry.utils;

    const consumers = RollPreparationManager.prepareConsumers($item, actionId);
    // TODO: Add support for effects
    const prompts = RollPreparationManager.preparePrompts($item, actionId);
    const rolls = RollPreparationManager.prepareRolls($item, actionId);
    const damageBonuses = BonusesManager.prepareGlobalDamageBonuses($item, rolls);
    const healingBonuses = BonusesManager.prepareGlobalHealingBonuses($item, rolls);

    const attackRoll = rolls.attack?.length ? rolls.attack[0][1] : ({} as AttackRollData);

    // Show Config
    const showAttackRoll = !isEmpty(attackRoll);
    const showAreaSection = false;
    const showOtherRolls = !!Object.values(rolls).flat().length;
    const showDamageBonuses = !!Object.values(damageBonuses).flat().length;
    const showHealingBonuses = !!Object.values(healingBonuses).flat().length;
    const showBonusesSection = showDamageBonuses || showHealingBonuses;
    const showPrompts = !!Object.values(prompts).flat().length;
    const showSpellSection = showActivationDialogSection(
        action,
        ["spell"],
        ["spellLevel", "spellPoints"],
    );
    const showUsesSection = showActivationDialogSection(
        action,
        ["actionUses", "itemUses"],
        ["actionUses", "itemUses"],
    );
    const showHitDiceSection = !!Object.values(consumers.hitDice ?? {}).flat().length;
    const showConsumersSection =
        showSpellSection || showUsesSection || showHitDiceSection;

    let attackRollData = {};
    let actionUsesData = {} as ResourceConsumptionManager.UsesConsumerData;
    let hitDiceData = {} as ResourceConsumptionManager.HitDiceConsumerData;
    let itemUsesData = {} as ResourceConsumptionManager.UsesConsumerData;
    let spellData = {} as ResourceConsumptionManager.SpellConsumerData;
    let selectedDamageBonuses = BonusesManager.getDefaultSelectionsFromBonuses({
        damageBonuses,
    });
    let selectedHealingBonuses = BonusesManager.getDefaultSelectionsFromBonuses({
        healingBonuses,
    });
    let selectedPrompts = BonusesManager.getDefaultSelectionsFromBonuses(prompts);
    let selectedRolls = BonusesManager.getDefaultSelectionsFromBonuses(rolls);
    let visibilityMode = game.settings?.get("core", "rollMode")!;

    // TODO: Place Template
    let placeTemplate =
        (game.settings.get("a5e", "placeItemTemplateDefault") as boolean) ||
        // @ts-expect-error
        (action?.area?.placeTemplate as boolean) ||
        false;

    // Validator
    const validator = new ConsumptionValidator($actor, $item, action, consumers);
    const preventActionRollOnWarning =
        (game.settings?.get("a5e", "preventActionRollOnWarning") as boolean) ?? false;

    $: consumerData = {
        actionUses: actionUsesData,
        hitDice: hitDiceData,
        itemUses: itemUsesData,
    };

    $: warnings = validator.validateData(consumerData);

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
                    <i class="fa-solid fa-circle-exclamation" />
                    {warning}
                </p>
            {/each}
        </section>
    {/if}

    {#if showAttackRoll}
        <Section heading="Attack Roll Config" --a5e-section-body-gap="0.5rem">
            <OutputVisibilitySection bind:visibilityMode />

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
                    on:updateSelection={({ detail }) => (selectedDamageBonuses = detail)}
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
                    on:updateSelection={({ detail }) => (selectedHealingBonuses = detail)}
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
            {#if showSpellSection}
                <SpellSection {consumers} bind:spellData />
            {/if}

            {#if showUsesSection}
                <UsesSection {consumers} bind:actionUsesData bind:itemUsesData />
            {/if}

            {#if showHitDiceSection}
                <HitDiceSection {consumers} bind:hitDiceData />
            {/if}
        </Section>
    {/if}

    <!-- TODO: Template Areas and Placement options -->
    <!-- {#if validateTemplateData($item.actions.get(actionId)?.area)}
        <FieldWrapper>
            <Checkbox
                label="A5E.ItemPlaceTemplate"
                checked={placeTemplate}
                on:updateSelection={({ detail }) => {
                    placeTemplate = detail;
                }}
            />
        </FieldWrapper>
    {/if} -->

    <Section>
        <button
            disabled={preventActionRollOnWarning && !!warnings.length}
            on:click|preventDefault={onSubmit}
        >
            {#if warnings.length}
                <i
                    class="fa-solid fa-circle-exclamation"
                    style="color: var(--a5e-color-warning);"
                />
            {:else}
                <i class="fa-solid fa-dice" />
            {/if}
            {localize("A5E.DialogSubmitRoll")}
        </button>
    </Section>
</form>

<style lang="scss">
    :global(.a5e-activation-dialog .window-content) {
        overflow-y: auto;
        max-height: 90vh;
    }

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
            font-family: $font-secondary;
            font-size: var(--a5e-text-size-xs);
        }
    }
</style>
