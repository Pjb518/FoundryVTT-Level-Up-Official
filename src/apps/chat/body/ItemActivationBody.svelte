<script>
    import { slide } from "svelte/transition";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import zip from "../../../utils/zip";

    import PromptButton from "./PromptButton.svelte";
    import RollSummary from "./RollSummary.svelte";

    import constructRollFormula from "../../../dice/constructRollFormula";
    import getKeyPressAsOptions from "../../handlers/getKeyPressAsOptions";
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

        return "#555";
    }

    function getPromptSubtitle(prompt) {
        switch (prompt.type) {
            case "abilityCheck":
                return getAbilityCheckPromptSubtitle(prompt);
            case "effect":
                return getEffectPromptSubtitle(prompt);
            case "savingThrow":
                return getSavingThrowPromptSubtitle(prompt);
            case "skillCheck":
                return getSkillCheckPromptSubtitle(prompt);
            case "generic":
                return getGenericRollPromptSubtitle(prompt);
        }
    }

    function getAbilityCheckPromptSubtitle(prompt) {
        return null;
    }

    function getEffectPromptSubtitle(prompt) {
        return "Apply effect";
    }

    function getSavingThrowPromptSubtitle(prompt) {
        return prompt.onSave;
    }

    function getSkillCheckPromptSubtitle(prompt) {
        return null;
    }

    function getGenericRollPromptSubtitle(prompt) {
        return null;
    }

    function getPromptTitle(prompt) {
        switch (prompt.type) {
            case "abilityCheck":
                return getAbilityCheckPromptTitle(prompt);
            case "effect":
                return getEffectPromptTitle(prompt);
            case "savingThrow":
                return getSavingThrowPromptTitle(prompt);
            case "skillCheck":
                return getSkillCheckPromptTitle(prompt);
            case "generic":
                return getGenericRollPromptTitle(prompt);
        }
    }

    function getAbilityCheckPromptTitle(prompt) {
        return localize("A5E.AbilityCheckPrompt", {
            ability: localize(abilities[prompt.ability]),
        });
    }

    function getEffectPromptTitle(prompt) {
        const effect = fromUuidSync(prompt.effectUuid);

        return effect.name;
    }

    function getSavingThrowPromptTitle(prompt) {
        if (game.settings.get("a5e", "protectRolls") ?? false) {
            const actorId = $message?.flags?.a5e?.actorId;
            const actor = fromUuidSync(actorId);

            if (actor && actor.type !== "character" && actor.permission < 2) {
                return localize("A5E.RollPromptSavingThrow", {
                    ability: localize(abilities[prompt.ability]),
                });
            }
        }

        return localize("A5E.RollPromptSavingThrowWithDC", {
            ability: localize(abilities[prompt.ability]),
            dc: prompt.dc,
        });
    }

    function getSkillCheckPromptTitle(prompt) {
        return localize("A5E.SkillCheckPrompt", {
            skill: localize(skills[prompt.skill]),
        });
    }

    function getGenericRollPromptTitle(prompt) {
        return prompt?.label || localize("A5E.Other");
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

    const { abilities, skills } = CONFIG.A5E;

    const rollSortKeyMap = {
        attack: 0,
        damage: 1,
        healing: 2,
        abilityCheck: 3,
        skillCheck: 4,
        savingThrow: 5,
        toolCheck: 6,
        generic: 7,
    };

    const promptTypes = [
        "abilityCheck",
        "savingThrow",
        "skillCheck",
        "generic",
        "effect",
    ];

    const { actionDescription, itemDescription, unidentifiedDescription } =
        $message.flags?.a5e;

    const prompts =
        $message.flags?.a5e?.prompts?.reduce((acc, prompt) => {
            acc[prompt.type] ??= [];
            acc[prompt.type].push(prompt);

            return acc;
        }, {}) ?? {};

    const rolls = zip($message.rolls, $message.flags?.a5e?.rollData).sort(
        (a, b) => rollSortKeyMap[a[1]?.type] - rollSortKeyMap[b[1]?.type]
    );

    const hasRolls = rolls.length;
    const hasPrompts = Object.values(prompts).flat().length;
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
                <hr class="a5e-rule a5e-rule--card" />

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
            {#each rolls ?? [] as [roll, rollData]}
                <RollSummary {roll} {rollData} />

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
                                title={getPromptTitle(prompt)}
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
        padding-top: 0.5rem;
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
