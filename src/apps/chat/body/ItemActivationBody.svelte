<script>
    import { slide } from "svelte/transition";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import zip from "../../../utils/zip";

    import D20Roll from "../dice/D20Roll.svelte";
    import PromptButton from "./PromptButton.svelte";
    import Roll from "../dice/Roll.svelte";

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
        return localize("A5E.GenericRollPrompt", {
            label: prompt?.label ?? localize("A5E.Other"),
        });
    }

    async function triggerPrompt(prompt) {
        const tokenActors = prepareSelectedTokenActors();

        if (!tokenActors.length) {
            ui.notifications.warn("No tokens selected");
            return;
        }

        if (prompt.type === "abilityCheck") {
            await triggerAbilityCheckPrompt(tokenActors, prompt);
        } else if (prompt.type === "effect") {
            await triggerEffectPrompt(tokenActors, prompt);
        } else if (prompt.type === "savingThrow") {
            await triggerSavingThrowPrompt(tokenActors, prompt);
        } else if (prompt.type === "skillCheck") {
            await triggerSkillCheckPrompt(tokenActors, prompt);
        } else if (prompt.type === "generic") {
            await triggerGenericRollPrompt(tokenActors, prompt);
        }
    }

    async function triggerAbilityCheckPrompt(tokenActors, prompt) {
        tokenActors.forEach((token) => {
            token.rollAbilityCheck(prompt.ability);
        });
    }

    async function triggerEffectPrompt(tokenActors, prompt) {
        const effect = fromUuidSync(prompt.effectUuid);

        tokenActors.forEach((actor) => {
            effect.transferEffect(actor);
        });
    }

    async function triggerSavingThrowPrompt(tokenActors, prompt) {
        tokenActors.forEach((token) => {
            token.rollSavingThrow(prompt.ability);
        });
    }

    async function triggerSkillCheckPrompt(tokenActors, prompt) {
        tokenActors.forEach((token) => {
            token.rollSkillCheck(prompt.skill, { abilityKey: prompt.ability });
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

        {#each rolls ?? [] as [roll, rollData]}
            <div class="roll-container">
                <header class="roll-header">
                    <h3 class="roll-label">{rollData.label}</h3>

                    {#if rollData.rollMode === 1}
                        <span
                            class="roll-mode-label roll-mode-label--advantage"
                            data-tooltip="Advantage"
                            data-tooltip-direction="LEFT"
                        >
                            Adv
                        </span>
                    {:else if rollData.rollMode === -1}
                        <span
                            class="roll-mode-label roll-mode-label--disadvantage"
                            data-tooltip="Disadvantage"
                            data-tooltip-direction="LEFT"
                        >
                            Dis
                        </span>
                    {/if}

                    {#if rollData.userLabel}
                        <span class="roll-sublabel">{rollData.userLabel}</span>
                    {/if}
                </header>

                {#if ["abilityCheck", "attack", "savingThrow", "skillCheck", "toolCheck"].includes(rollData.type)}
                    <D20Roll {roll} critThreshold={rollData.critThreshold} />
                {:else}
                    <Roll {roll} {rollData} />
                {/if}
            </div>
        {/each}
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

    .prompts {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .roll-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .roll-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .roll-label {
        width: fit-content;
        margin: 0;
        font-size: 0.833rem;
        font-weight: bold;
        border: 0;
    }

    .roll-mode-label {
        display: block;
        flex-shrink: 0;
        width: fit-content;
        margin-left: auto;
        padding: 0.15rem 0.4rem;
        font-size: 0.694rem;
        line-height: 1;
        color: white;
        border: 1px solid;
        border-radius: 3px;

        &--advantage {
            border-color: #425f65;
            background: #425f65;
        }

        &--disadvantage {
            border-color: #772020;
            background: #8b2525;
        }
    }

    .roll-sublabel {
        width: 100%;
        font-size: 0.694rem;
        color: #7e7960;
    }
</style>
