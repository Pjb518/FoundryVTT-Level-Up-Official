<script>
    import { slide } from "svelte/transition";

    import PromptButton from "./PromptButton.svelte";
    import RollSummary from "./RollSummary.svelte";

    import constructRollFormula from "../../../dice/constructRollFormula";
    import getKeyPressAsOptions from "../../handlers/getKeyPressAsOptions";
    import getPromptTitle from "../../dataPreparationHelpers/cardPrompts/getPromptTitle";
    import getPromptSubtitle from "../../dataPreparationHelpers/cardPrompts/getPromptSubtitle";
    import preparePrompts from "../../dataPreparationHelpers/cardPrompts/preparePrompts";
    import prepareRolls from "../../dataPreparationHelpers/cardRolls/prepareRolls";
    import prepareSelectedTokenActors from "../../dataPreparationHelpers/prepareSelectedTokenActors";
    import pressedKeysStore from "../../../stores/pressedKeysStore";

    export let message;
    export let hideDescription = false;

    function getEffectIcon(prompt) {
        if (prompt.type !== "effect") return null;

        const effect = fromUuidSync(prompt.effectUuid);

        return effect.icon;
    }

    function getHoverColor(pressedKeysStore) {
        if (pressedKeysStore.Shift) return "#2b6537";
        if (pressedKeysStore.Control) return "#8b2525";

        return "#191813";
    }

    async function toggleRollMode(rollIndex, rollMode) {
        const [originalRoll, originalRollData] = rolls[rollIndex];
        const originalRollMode = originalRollData.rollMode;

        if (originalRollMode === rollMode) return;

        const newRoll = new Roll(
            originalRoll.formula,
            { ...originalRoll.data },
            { ...originalRoll.options }
        );

        newRoll.terms = [...originalRoll.terms];

        const d20Term = newRoll.terms[0];

        // Remove kh and kl modifiers
        d20Term.modifiers = d20Term.modifiers.filter(
            (modifier) => !["kh", "kl"].includes(modifier)
        );

        if (rollMode === 0) {
            // Set the number of dice to 1 and keep only the first die
            d20Term.number = 1;
            d20Term.results = [d20Term.results.shift()];
        } else {
            // Add a kh modifier for advantage and a kl modifier for disadvantage
            d20Term.modifiers.push(rollMode === 1 ? "kh" : "kl");

            // Add a second die if there isn't one already
            if (originalRollMode === 0) {
                d20Term.number = 2;
                await d20Term.roll();
            }
        }

        // Reset all the metadata for the new d20Term results
        d20Term.results.forEach((term) => {
            term.active = true;
            delete term.discarded;
            delete term.indexThrow;
        });

        d20Term._evaluateModifiers();

        // Update the formula and total information for the new roll and evaluate the roll
        newRoll._formula = Roll.getFormula(newRoll.terms);
        newRoll._total = newRoll._evaluateTotal();
        await newRoll.evaluate();

        // Replace the old roll with the new one in the message rolls array
        $message.rolls.splice(rollIndex, 1, newRoll);

        // Update the corresponding rollData object
        $message.flags.a5e.rollData.splice(rollIndex, 1, {
            ...$message.flags.a5e.rollData[rollIndex],
            rollMode,
        });

        // Permanently update the message with the new data
        await $message.update({
            rolls: $message.rolls,
            "flags.a5e.rollData": $message.flags.a5e.rollData,
        });
    }

    async function triggerPrompt(prompt) {
        const tokenActors = prepareSelectedTokenActors();
        const options = getKeyPressAsOptions($pressedKeysStore);

        if (!tokenActors.length) {
            ui.notifications.warn("No tokens selected");
            return;
        }

        if (prompt.type === "abilityCheck") {
            await triggerAbilityCheckPrompt(tokenActors, prompt, options);
        } else if (prompt.type === "effect") {
            await triggerEffectPrompt(tokenActors, prompt);
        } else if (prompt.type === "savingThrow") {
            await triggerSavingThrowPrompt(tokenActors, prompt, options);
        } else if (prompt.type === "skillCheck") {
            await triggerSkillCheckPrompt(tokenActors, prompt, options);
        } else if (prompt.type === "generic") {
            await triggerGenericRollPrompt(tokenActors, prompt);
        }
    }

    async function triggerAbilityCheckPrompt(tokenActors, prompt, options) {
        tokenActors.forEach((token) => {
            token.rollAbilityCheck(prompt.ability, options);
        });
    }

    async function triggerEffectPrompt(tokenActors, prompt) {
        const effect = fromUuidSync(prompt.effectUuid);

        tokenActors.forEach((actor) => {
            effect.transferEffect(actor);
        });
    }

    async function triggerSavingThrowPrompt(tokenActors, prompt, options) {
        tokenActors.forEach((token) => {
            token.rollSavingThrow(prompt.ability, options);
        });
    }

    async function triggerSkillCheckPrompt(tokenActors, prompt, options) {
        tokenActors.forEach((token) => {
            token.rollSkillCheck(prompt.skill, {
                abilityKey: prompt.ability,
                ...options,
            });
        });
    }

    async function triggerGenericRollPrompt(tokenActors, prompt) {
        for (const token of tokenActors) {
            const { rollFormula } = constructRollFormula({
                actor: token,
                formula: prompt.formula,
            });

            await new Roll(rollFormula).toMessage({ async: true });
        }
    }

    const promptTypes = [
        "abilityCheck",
        "savingThrow",
        "skillCheck",
        "generic",
        "effect",
    ];

    const { actionDescription, itemDescription, unidentifiedDescription } =
        $message.flags?.a5e;

    const prompts = preparePrompts($message);
    const hasPrompts = Object.values(prompts).flat().length;
    const rolls = prepareRolls($message);
    const hasRolls = rolls.length;
    const item = fromUuidSync($message?.flags?.a5e?.itemId ?? "");

    $: hoverColor = getHoverColor($pressedKeysStore);
</script>

<article>
    {#if !hideDescription}
        <section
            class="description-block"
            in:slide={{ duration: 150 }}
            out:slide={{ duration: 150 }}
        >
            {#if itemDescription || unidentifiedDescription}
                <hr class="a5e-rule" />

                <div>
                    <!-- svelte-ignore missing-declaration -->
                    {#if !game.user.isGM && item?.type === "object" && item?.system?.unidentified}
                        {@html unidentifiedDescription}
                    {:else}
                        {@html itemDescription}
                    {/if}
                </div>
            {/if}

            {#if actionDescription}
                <hr class="a5e-rule a5e-rule--card" />

                <div>
                    {@html actionDescription}
                </div>
            {/if}
        </section>
    {/if}

    {#if hasRolls}
        <hr class="a5e-rule a5e-rule--card" />

        <section class="rolls">
            {#each rolls ?? [] as [roll, rollData], i}
                <RollSummary
                    {roll}
                    {rollData}
                    on:toggleRollMode={({ detail }) =>
                        toggleRollMode(i, detail)}
                />

                {#if rolls.length > 1 && rollData.type === "attack"}
                    <hr class="a5e-rule" />
                {/if}
            {/each}
        </section>
    {/if}

    {#if hasPrompts}
        <hr class="a5e-rule a5e-rule--card" />

        <section class="prompts">
            {#each promptTypes as promptType}
                {#if prompts[promptType]?.length}
                    <section class="prompt-button-wrapper">
                        {#each prompts[promptType] as prompt}
                            <PromptButton
                                {prompt}
                                icon={getEffectIcon(prompt)}
                                title={getPromptTitle(
                                    prompt,
                                    $message?.flags?.a5e?.actorId
                                )}
                                subtitle={getPromptSubtitle(prompt)}
                                --hover-color={hoverColor}
                                on:triggerPrompt={() => triggerPrompt(prompt)}
                            />
                        {/each}
                    </section>
                {/if}
            {/each}
        </section>
    {/if}
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .description-block {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .prompt-button-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .prompts,
    .rolls {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>
