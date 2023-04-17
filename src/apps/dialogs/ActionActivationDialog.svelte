<script>
    import { getContext, setContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import computeSaveDC from "../utils/computeSaveDC";
    import validateTemplateData from "../../utils/measuredTemplates/validateTemplateData";

    import prepareConsumers from "../dataPreparationHelpers/itemActivationConsumers/prepareConsumers";
    import preparePrompts from "../dataPreparationHelpers/itemActivationPrompts/preparePrompts";
    import prepareRolls from "../dataPreparationHelpers/itemActivationRolls/prepareRolls";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import AttackRollSection from "../components/activationDialog/AttackRollSection.svelte";
    import HitDiceSection from "../components/activationDialog/HitDiceSection.svelte";
    import SpellSection from "../components/activationDialog/SpellSection.svelte";
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

    function getInvalidSelections(property) {
        return Object.values(property ?? {})
            .flat()
            .reduce((acc, [key, value]) => {
                if (
                    ["generic", "healing", "damage"].includes(value.type) &&
                    !value.formula
                ) {
                    acc.push(key);
                }

                return acc;
            }, []);
    }

    function onSubmit() {
        // TODO: Clean this up. A lot of stuff here is prototyping for the chat cards
        console.log(attackRollData);

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

    const rollHeadingMap = {
        abilityCheck: "Ability Checks",
        damage: "Damage Rolls",
        generic: "Generic Rolls",
        healing: "Healing Rolls",
        savingThrow: "Saving Throws",
        skillCheck: "Skill Checks",
        toolCheck: "Tool Checks",
    };

    const promptHeadingMap = {
        abilityCheck: "Ability Check Prompts",
        savingThrow: "Saving Throw Prompts",
        skillCheck: "Skill Check Prompts",
        generic: "Generic Roll Prompts",
    };

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);
    const action = $item.actions[actionId];

    const prompts = preparePrompts(action.prompts);
    const rolls = prepareRolls(action.rolls);
    const consumers = prepareConsumers(action.consumers);

    const attackRoll = rolls?.attack?.length ? rolls.attack[0][1] : {};
    const otherRolls = Object.entries(rolls).reduce(
        (acc, [rollType, rolls]) => {
            if (rollType === "attack") return acc;
            acc[rollType] = rolls;

            return acc;
        },
        {}
    );

    let attackRollData = {};
    let actionUsesData = {};
    let hitDiceData = {};
    let itemUsesData = {};
    let spellData = {};
    let disabledRolls = getInvalidSelections(rolls);
    let disabledPrompts = getInvalidSelections(prompts);
    let placeTemplate = action?.area?.placeTemplate ?? false;
    let selectedRolls = getDefaultSelections(rolls);
    let selectedPrompts = getDefaultSelections(prompts);

    setContext("actionId", actionId);
    setContext("actor", actor);
    setContext("dialog", dialog);
    setContext("item", item);
</script>

<form>
    <!-- TODO: Extract this to its own component -->
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
        <FormSection hint="A5E.RollsHint">
            <div class="roll-wrapper">
                {#each Object.entries(otherRolls) as [rollType, _rolls]}
                    {#if _rolls.length}
                        <section>
                            <h3 class="section-subheading">
                                {rollHeadingMap[rollType]}
                            </h3>

                            <CheckboxGroup
                                options={_rolls.map(([key, roll]) => [
                                    key,
                                    roll.label ?? roll.defaultLabel,
                                ])}
                                disabledOptions={disabledRolls}
                                selected={selectedRolls}
                                on:updateSelection={(event) =>
                                    (selectedRolls = event.detail)}
                            />
                        </section>
                    {/if}
                {/each}
            </div>
        </FormSection>
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

    <!-- If there are no prompts, hide this section -->
    {#if Object.values(prompts).flat().length}
        <FormSection hint="A5E.PromptsHint">
            <div class="prompt-wrapper">
                {#each Object.entries(prompts) as [promptType, _prompts]}
                    {#if _prompts.length}
                        <section>
                            <h3 class="section-subheading">
                                {promptHeadingMap[promptType]}
                            </h3>

                            <CheckboxGroup
                                options={_prompts.map(([key, prompt]) => [
                                    key,
                                    prompt.label ?? prompt.defaultLabel,
                                ])}
                                disabledOptions={disabledPrompts}
                                selected={selectedPrompts}
                                on:updateSelection={(event) =>
                                    (selectedPrompts = event.detail)}
                            />
                        </section>
                    {/if}
                {/each}
            </div>
        </FormSection>
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

    .roll-wrapper,
    .prompt-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .section-subheading {
        width: 100%;
        font-size: 0.833rem;
        font-weight: bold;
        margin-bottom: 0.25rem;
    }
</style>
