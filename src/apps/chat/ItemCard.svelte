<svelte:options accessors={true} />

<script>
    import { setContext } from "svelte";
    import { slide } from "svelte/transition";

    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { localize } from "@typhonjs-fvtt/runtime/util/i18n";

    import constructRollFormula from "../../dice/constructRollFormula";
    import getKeyPressAsOptions from "../handlers/getKeyPressAsOptions";
    import getPromptTitle from "../dataPreparationHelpers/cardPrompts/getPromptTitle";
    import getPromptSubtitle from "../dataPreparationHelpers/cardPrompts/getPromptSubtitle";
    import preparePrompts from "../dataPreparationHelpers/cardPrompts/preparePrompts";
    import prepareRolls from "../dataPreparationHelpers/cardRolls/prepareRolls";
    import prepareSelectedTokenActors from "../dataPreparationHelpers/prepareSelectedTokenActors";
    import pressedKeysStore from "../../stores/pressedKeysStore";
    import toggleExpertiseDice from "../dataPreparationHelpers/cardRolls/toggleExpertiseDice";
    import toggleRollMode from "../dataPreparationHelpers/cardRolls/toggleRollMode";
    import zip from "../../utils/zip";

    import ItemSummary from "../components/itemSummaries/ItemSummary.svelte";
    import ItemCardHeader from "./ItemCardHeader.svelte";
    import PromptButton from "./body/PromptButton.svelte";
    import RollSummary from "./body/RollSummary.svelte";

    export let messageDocument;

    function getEffectIcon(effect) {
        return effect?.img ?? "icons/svg/hazard.svg";
    }

    function getSpellComponents(item) {
        if (!item?.system?.components) return [];

        const { spellComponents, spellComponentAbbreviations } = CONFIG.A5E;

        const components = Object.entries(item.system.components)
            .filter(([, hasComponent]) => hasComponent)
            .map(([component]) => ({
                label: spellComponentAbbreviations[component] ?? component,
                tooltip: spellComponents[component] ?? component,
            }));

        if (item.system.concentration) {
            components.push({
                label: localize("A5E.SpellConcentrationAbbr"),
                tooltip: localize("A5E.SpellConcentration"),
            });
        }

        if (item.system.ritual) {
            components.push({
                label: localize("A5E.SpellRitualAbbr"),
                tooltip: localize("A5E.SpellRitual"),
            });
        }

        return components;
    }

    function getSubtitle(name, actionName) {
        if (!actionName || typeof actionName !== "string") return null;
        if (name.trim() === actionName.trim()) return null;

        return actionName;
    }

    function getHoverColor(pressedKeysStore) {
        if (pressedKeysStore.Shift) return "#2b6537";
        if (pressedKeysStore.Control) return "var(--a5e-color-error)";

        return "var(--a5e-color-text-dark)";
    }

    function prepareRollColor(rollData) {
        if (!game.settings?.get("a5e", "enableDamageRollColors")) return null;

        const { damageColors, healingColors } = CONFIG.A5E;

        if (rollData.type === "damage") return damageColors[rollData.damageType];
        if (rollData.type === "healing") return healingColors[rollData.healingType];

        return null;
    }

    async function _toggleExpertiseDice(rollIndex, expertiseDice) {
        toggleExpertiseDice($message, rolls, rollIndex, expertiseDice);
    }

    async function _toggleRollMode(rollIndex, rollMode) {
        const [, originalRollData] = rolls[rollIndex];
        toggleRollMode($message, rolls, rollIndex, rollMode);

        // Use the new attack roll information to determine whether to display crit damage
        if (originalRollData.type === "attack") reevaluateCritMode();
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

    async function triggerEffect(effect) {
        const tokenActors = prepareSelectedTokenActors();

        if (!tokenActors.length) {
            ui.notifications.warn("No tokens selected");
            return;
        }

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
                item: item,
            });

            await new Roll(rollFormula).toMessage({ async: true });
        }
    }

    function reevaluateCritMode() {
        const isCrit = zip($message.rolls, $message.system.rollData).some(
            ([roll, rollData]) => {
                if (rollData.type !== "attack") return false;

                const d20Roll = roll.terms.find((term) => term.faces === 20);

                if (!d20Roll) return false;

                return d20Roll.results.some(
                    ({ result, active }) =>
                        active && result >= (rollData.critThreshold ?? 20),
                );
            },
        );

        if (isCrit === undefined || isCrit === null) return;

        toggleCriticalDamage(isCrit ? 1 : 0);
    }

    function toggleCriticalDamage(newCritMode) {
        const rolls = zip($message.rolls, $message.system.rollData).map(
            ([roll, rollData]) => {
                if (rollData.type !== "damage") return roll;
                if (!rollData.canCrit ?? true) return roll;
                if (!rollData.critRoll || !rollData.baseRoll) return roll;

                if (newCritMode === 1) return Roll.fromData(rollData.critRoll);
                if (newCritMode === 0) return Roll.fromData(rollData.baseRoll);

                if (rollData.baseRoll.formula === roll.formula) {
                    return Roll.fromData(rollData.critRoll);
                }

                return Roll.fromData(rollData.baseRoll);
            },
        );

        $message.update({ rolls });
    }

    function repeatRoll() {
        const item = fromUuidSync($message.system.itemId);
        const actionId = $message.system.actionId ?? null;

        item.activate(actionId);
    }

    const message = new TJSDocument(messageDocument);
    const { system } = $message;

    const promptTypes = [
        "abilityCheck",
        "savingThrow",
        "skillCheck",
        "generic",
        "effect",
    ];

    const { actionName, actorName, img } = system;
    const { actionDescription, itemDescription, unidentifiedDescription } = system;

    const { isGM } = game.user;
    const { A5E } = CONFIG;

    const item = $message?.item;
    const prompts = preparePrompts($message);
    const hasPrompts = Object.values(prompts).flat().length;
    const rolls = prepareRolls($message);
    const hasRolls = rolls.length;
    const effects = system.effects.map((id) => item?.effects.get(id));
    const hasEffects = !!effects.length;

    const itemName = item.name ?? "";
    let subtitle = getSubtitle(itemName, actionName);

    let hideDescription =
        game.settings.get("a5e", "hideChatDescriptionsByDefault") ?? false;
    let backgroundColor = $message?.blind
        ? "#f5eaf5"
        : $message?.whisper?.length
          ? "#e8e8ef"
          : "#f6f1ea";

    setContext("message", message);

    $: hoverColor = getHoverColor($pressedKeysStore);
    $: summaryData = $message?.system?.summaryData;
</script>

<ItemCardHeader
    messageDocument={$message}
    on:repeatCard={repeatRoll}
    on:toggleDescription={() => (hideDescription = !hideDescription)}
    on:toggleCriticalDamage={toggleCriticalDamage}
/>

<article class="a5e-chat-card__body" style="background-color: {backgroundColor};">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <header
        class="a5e-chat-card__body__header a5e-chat-card__body__header--clickable"
        class:a5e-chat-card__body__header--subtitle={!!subtitle}
        role="button"
        tabindex="0"
        on:click={() => (hideDescription = !hideDescription)}
    >
        <img class="a5e-chat-card__body__header__img" src={img} alt={itemName} />

        <span class="a5e-chat-card__body__header__title-container">
            <h2 class="a5e-chat-card__body__header__title">{itemName}</h2>

            {#if subtitle}
                <h3 class="a5e-chat-card__body__header__subtitle">{subtitle}</h3>
            {/if}
        </span>
    </header>

    {#if Object.values(summaryData ?? {}).some(Boolean)}
        <ItemSummary {summaryData} />
    {/if}

    {#if (itemDescription || unidentifiedDescription || actionDescription) && !hideDescription}
        <section
            class="description-block"
            in:slide={{ duration: 150 }}
            out:slide={{ duration: 150 }}
        >
            {#if itemDescription || unidentifiedDescription}
                <hr class="a5e-rule a5e-rule--card" />

                <div>
                    {#if !isGM && item?.type === "object" && item?.system?.unidentified}
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
                {#if rollData?.baseRoll?.formula === "0" && roll._formula === "0"}
                    <!-- Hide checks with formula of 0 -->
                {:else}
                    <RollSummary
                        {roll}
                        {rollData}
                        --a5e-roll-color={prepareRollColor(rollData)}
                        on:toggleRollMode={({ detail }) => _toggleRollMode(i, detail)}
                        on:toggleExpertiseDice={({ detail }) =>
                            _toggleExpertiseDice(i, detail)}
                    />

                    {#if rolls.length > 1 && rollData.type === "attack"}
                        <hr class="a5e-rule" />
                    {/if}
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
                                title={getPromptTitle(prompt, $message?.system?.actorId)}
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

    {#if hasEffects}
        {#each effects as effect}
            <PromptButton
                prompt={{ type: "effect" }}
                icon={getEffectIcon(effect)}
                title={effect.name}
                subtitle="Apply Effect"
                --hover-color={hoverColor}
                on:triggerPrompt={() => triggerEffect(effect)}
            />
        {/each}
    {/if}
</article>

{#if item.type === "spell"}
    <hr class="a5e-rule a5e-rule--card" style="margin-block: 0.5rem;" />

    {@const spellComponents = getSpellComponents(item)}
    {@const spellLevel = A5E.spellLevels[item?.system?.level]}
    {@const castingLevel = A5E.spellLevels[$message?.system?.castingLevel ?? ""]}

    <footer class="a5e-chat-card__footer">
        <span class="spell-level">
            {spellLevel}

            {#if castingLevel && spellLevel !== castingLevel}
                (Cast at {castingLevel})
            {/if}
        </span>

        {#if spellComponents.length}
            <ul class="component-wrapper">
                {#each spellComponents as component}
                    <li
                        class="component"
                        data-tooltip={component.tooltip}
                        data-tooltip-direction="UP"
                    >
                        {component.label}
                    </li>
                {/each}
            </ul>
        {/if}
    </footer>
{/if}

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

    .component-wrapper {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
    }

    .component {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
        width: 1rem;
        border-radius: var(--a5e-border-radius-standard);
        font-size: var(--a5e-text-size-xxs);
        background: var(--indicator-background, #c6c5bc);
    }

    .spell-level {
        font-size: var(--a5e-text-size-xs);
    }
</style>
