<script>
    import { getContext, setContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import ConsumptionValidator from "../../utils/validators/ConsumptionValidator";

    import computeSaveDC from "../utils/computeSaveDC";
    import validateTemplateData from "../../utils/measuredTemplates/validateTemplateData";

    import prepareConsumers from "../dataPreparationHelpers/itemActivationConsumers/prepareConsumers";
    import preparePrompts from "../dataPreparationHelpers/itemActivationPrompts/preparePrompts";
    import prepareRolls from "../dataPreparationHelpers/itemActivationRolls/prepareRolls";

    import FormSection from "../components/FormSection.svelte";

    import AttackRollSection from "../components/activationDialog/AttackRollSection.svelte";
    import HitDiceSection from "../components/activationDialog/HitDiceSection.svelte";
    import SpellSection from "../components/activationDialog/SpellSection.svelte";
    import PromptsSection from "../components/activationDialog/PromptsSection.svelte";
    import RollsSection from "../components/activationDialog/RollsSection.svelte";
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
        });
    }

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);
    const action = $item.actions[actionId];

    const prompts = preparePrompts(action.prompts);
    const rolls = prepareRolls(action.rolls);
    const consumers = prepareConsumers(action.consumers);

    const attackRoll = rolls?.attack?.length ? rolls.attack[0][1] : {};

    let attackRollData = {};
    let actionUsesData = {};
    let hitDiceData = {};
    let itemUsesData = {};
    let spellData = {};
    let placeTemplate = action?.area?.placeTemplate ?? false;
    let selectedPrompts = getDefaultSelections(prompts);
    let selectedRolls = getDefaultSelections(rolls);

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
</script>

<form>
    {validator.validateData(consumerData)}

    <!-- svelte-ignore missing-declaration -->
    {#if !foundry.utils.isEmpty(attackRoll)}
        <AttackRollSection {attackRoll} {options} bind:attackRollData />
    {/if}

    {#if validateTemplateData($item, actionId)}
        <FormSection>
            <div class="u-align-center u-flex u-gap-md">
                <input
                    class="u-pointer"
                    type="checkbox"
                    id="{dialog.id}-place-template"
                    bind:checked={placeTemplate}
                />

                <label class="u-pointer" for="{dialog.id}-place-template">
                    {localize("A5E.ItemPlaceTemplate")}
                </label>
            </div>
        </FormSection>
    {/if}

    <!-- If there are no rolls, hide this section -->
    {#if Object.values(rolls).flat().length}
        <RollsSection {rolls} bind:selectedRolls />
    {/if}

    <!-- If there are no prompts, hide this section -->
    {#if Object.values(prompts).flat().length}
        <PromptsSection {prompts} bind:selectedPrompts />
    {/if}

    {#if Object.values(consumers?.spell ?? {}).flat().length}
        <SpellSection {consumers} bind:spellData />
    {/if}

    {#if Object.values(consumers?.actionUses ?? {}).flat().length || Object.values(consumers?.itemUses ?? {}).flat().length}
        <UsesSection {consumers} bind:actionUsesData bind:itemUsesData />
    {/if}

    {#if Object.values(consumers?.hitDice ?? {}).flat().length}
        <HitDiceSection {consumers} bind:hitDiceData />
    {/if}

    <section>
        <button on:click|preventDefault={onSubmit}>
            <i class="fa-solid fa-dice" />
            {localize("A5E.DialogSubmitRoll")}
        </button>
    </section>
</form>

<style lang="scss">
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
</style>
