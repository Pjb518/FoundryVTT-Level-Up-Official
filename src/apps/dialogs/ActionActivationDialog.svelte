<script>
    import { getContext, setContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import ConsumptionValidator from "../../utils/validators/ConsumptionValidator";

    import computeSaveDC from "../../utils/computeSaveDC";
    import showActivationDialogSection from "../../utils/showActivationDialogSection";
    import validateTemplateData from "../../utils/measuredTemplates/validateTemplateData";

    import prepareConsumers from "../dataPreparationHelpers/itemActivationConsumers/prepareConsumers";
    import prepareDamageBonuses from "../dataPreparationHelpers/itemActivationRolls/prepareDamageBonuses";
    import prepareHealingBonuses from "../dataPreparationHelpers/itemActivationRolls/prepareHealingBonuses";
    import preparePrompts from "../dataPreparationHelpers/itemActivationPrompts/preparePrompts";
    import prepareRolls from "../dataPreparationHelpers/itemActivationRolls/prepareRolls";

    import Checkbox from "../components/Checkbox.svelte";
    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import FormSection from "../components/FormSection.svelte";

    import AttackRollSection from "../components/activationDialog/AttackRollSection.svelte";
    import HitDiceSection from "../components/activationDialog/HitDiceSection.svelte";
    import OutputVisibilitySection from "../components/activationDialog/OutputVisibilitySection.svelte";
    import PromptsSection from "../components/activationDialog/PromptsSection.svelte";
    import RollsSection from "../components/activationDialog/RollsSection.svelte";
    import SpellSection from "../components/activationDialog/SpellSection.svelte";
    import UsesSection from "../components/activationDialog/UsesSection.svelte";

    export let { actionId, actorDocument, dialog, itemDocument, options } =
        getContext("#external").application;

    function getDefaultSelections(property) {
        return Object.values(property ?? {})
            .flat()
            .reduce((acc, [key, value]) => {
                if (
                    ["generic", "healing", "damage"].includes(value.type) &&
                    !value.formula
                ) {
                    return acc;
                }

                if (value.default ?? true) acc.push(key);
                return acc;
            }, []);
    }

    function onSubmit() {
        // TODO: Clean this up. A lot of stuff here is prototyping for the chat cards

        dialog.submit({
            attack: attackRollData,

            consumers: {
                actionUses: actionUsesData,
                hitDice: hitDiceData,
                itemUses: itemUsesData,
                spell: spellData,
            },
            damageBonuses: Object.entries(
                $actor.system.bonuses.damage ?? {}
            ).reduce((acc, [key, damageBonus]) => {
                if (selectedDamageBonuses.includes(key)) {
                    acc.push(damageBonus);
                }

                return acc;
            }, []),
            healingBonuses: Object.entries(
                $actor.system.bonuses.healing ?? {}
            ).reduce((acc, [key, healingBonus]) => {
                if (selectedHealingBonuses.includes(key)) {
                    acc.push(healingBonus);
                }

                return acc;
            }, []),
            prompts: Object.entries(action.prompts ?? {}).reduce(
                (acc, [key, prompt]) => {
                    if (selectedPrompts.includes(key)) {
                        if (prompt.type === "savingThrow") {
                            prompt.dc = computeSaveDC($actor, prompt.saveDC);
                        }

                        acc.push(prompt);
                    }

                    return acc;
                },
                []
            ),
            rolls: Object.entries(action.rolls ?? {}).reduce(
                (acc, [key, roll]) => {
                    // Attack rolls are excluded here because they are formatted differently
                    // and require additional processing.
                    if (selectedRolls.includes(key) && roll.type !== "attack") {
                        acc.push(roll);
                    }

                    return acc;
                },
                []
            ),
            placeTemplate,
            visibilityMode,
        });
    }

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);
    const action = $item.actions[actionId];

    const consumers = prepareConsumers(action.consumers);
    const prompts = preparePrompts(action.prompts, $item);
    const rolls = prepareRolls(action.rolls);
    const damageBonuses = prepareDamageBonuses($actor, $item, rolls);
    const healingBonuses = prepareHealingBonuses($actor, $item, rolls);

    const attackRoll = rolls?.attack?.length ? rolls.attack[0][1] : {};

    let attackRollData = {};
    let actionUsesData = {};
    let hitDiceData = {};
    let itemUsesData = {};
    let spellData = {};
    let selectedDamageBonuses = getDefaultSelections({ damageBonuses });
    let selectedHealingBonuses = getDefaultSelections({ healingBonuses });
    let selectedPrompts = getDefaultSelections(prompts);
    let selectedRolls = getDefaultSelections(rolls);
    let visibilityMode = game.settings.get("core", "rollMode");

    let placeTemplate =
        game.settings.get("a5e", "placeItemTemplateDefault") ||
        action?.area?.placeTemplate ||
        false;

    const validator = new ConsumptionValidator(
        $actor,
        $item,
        action,
        consumers
    );

    setContext("actionId", actionId);
    setContext("actor", actor);
    setContext("dialog", dialog);
    setContext("item", item);

    $: consumerData = {
        actionUses: actionUsesData,
        hitDice: hitDiceData,
        itemUses: itemUsesData,
    };

    $: warnings = validator.validateData(consumerData);
</script>

<form>
    {#if warnings.length}
        <section class="warning__wrapper">
            {#each warnings as warning}
                <p class="warning" style="color: $color-warning;">
                    <i class="fa-solid fa-circle-exclamation" />
                    {warning}
                </p>
            {/each}
        </section>
    {/if}

    <OutputVisibilitySection bind:visibilityMode />

    <!-- svelte-ignore missing-declaration -->
    {#if !foundry.utils.isEmpty(attackRoll)}
        <AttackRollSection {attackRoll} {options} bind:attackRollData />
    {/if}

    {#if validateTemplateData($item.actions.get(actionId)?.area)}
        <FormSection>
            <Checkbox
                label="A5E.ItemPlaceTemplate"
                checked={placeTemplate}
                on:updateSelection={({ detail }) => {
                    placeTemplate = detail;
                }}
            />
        </FormSection>
    {/if}

    <!-- If there are no rolls, hide this section -->
    {#if Object.values(rolls).flat().length}
        <RollsSection {rolls} bind:selectedRolls />
    {/if}

    <!-- If there are no rolls, hide this section -->
    {#if Object.values(damageBonuses).flat().length}
        <FormSection heading="Damage Bonuses">
            <CheckboxGroup
                options={damageBonuses.map(([key, damageBonus]) => [
                    key,
                    damageBonus.label || damageBonus.defaultLabel,
                ])}
                selected={selectedDamageBonuses}
                on:updateSelection={({ detail }) =>
                    (selectedDamageBonuses = detail)}
            />
        </FormSection>
    {/if}

    <!-- If there are no rolls, hide this section -->
    {#if Object.values(healingBonuses).flat().length}
        <FormSection heading="Healing Bonuses">
            <CheckboxGroup
                options={healingBonuses.map(([key, healingBonus]) => [
                    key,
                    healingBonus.label || healingBonus.defaultLabel,
                ])}
                selected={selectedHealingBonuses}
                on:updateSelection={({ detail }) =>
                    (selectedHealingBonuses = detail)}
            />
        </FormSection>
    {/if}

    <!-- If there are no prompts, hide this section -->
    {#if Object.values(prompts).flat().length}
        <PromptsSection {prompts} bind:selectedPrompts />
    {/if}

    {#if showActivationDialogSection(action, ["spell"], ["spellLevel", "spellPoints"])}
        <SpellSection {consumers} bind:spellData />
    {/if}

    {#if showActivationDialogSection(action, ["actionUses", "itemUses"], ["actionUses", "itemUses"])}
        <UsesSection {consumers} bind:actionUsesData bind:itemUsesData />
    {/if}

    {#if Object.values(consumers?.hitDice ?? {}).flat().length}
        <HitDiceSection {consumers} bind:hitDiceData />
    {/if}

    <section>
        <!-- svelte-ignore missing-declaration -->
        <button
            disabled={game.settings.get("a5e", "preventActionRollOnWarning") &&
                warnings.length}
            on:click|preventDefault={onSubmit}
        >
            {#if warnings.length}
                <i
                    class="fa-solid fa-circle-exclamation"
                    style="color: $color-warning;"
                />
            {:else}
                <i class="fa-solid fa-dice" />
            {/if}
            {localize("A5E.DialogSubmitRoll")}
        </button>
    </section>
</form>

<style lang="scss">
    :global(.a5e-activation-dialog .window-content) {
        overflow-y: auto;
        max-height: 90vh;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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
            font-size: $font-size-xs;
        }
    }
</style>
