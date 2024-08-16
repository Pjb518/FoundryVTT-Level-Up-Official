<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext } from "svelte";

    import getExpertiseDieSize from "../../../utils/getExpertiseDieSize";
    import prepareRollTooltip from "../../dataPreparationHelpers/cardRollTooltips/prepareRollTooltip";

    import DamageButtons from "./DamageButtons.svelte";
    import RollConfigurationOptions from "./RollConfigurationOptions.svelte";

    export let roll;
    export let rollData = {};
    export let isAction = true;

    function determineIfCriticalFailure(roll) {
        const d20Roll = roll.terms.find((term) => term.faces === 20);

        if (!d20Roll) return false;

        return d20Roll.results.some(({ result, active }) => active && result === 1);
    }

    function determineIfCriticalSuccess(roll) {
        const d20Roll = roll.terms.find((term) => term.faces === 20);

        if (!d20Roll) return false;

        return d20Roll.results.some(
            ({ result, active }) => active && result >= (rollData.critThreshold ?? 20),
        );
    }

    function getRollModeLabel({ rollMode }) {
        if (!rollMode) return null;

        return localize(
            rollMode === 1 ? "A5E.RollModeAdvantage" : "A5E.RollModeDisadvantage",
        );
    }

    function getExpertiseLabel({ expertiseDice }) {
        if (!expertiseDice) return null;

        return localize("A5E.ExpertiseDieSpecific", {
            dieSize: getExpertiseDieSize(expertiseDice),
        });
    }

    async function rollOnSkillTable(skillKey, resultType) {
        console.log("Here");
        const tableKey =
            resultType === "critical" ? "skillCriticalTables" : "skillFumbleTables";

        const critTableUUID = CONFIG.A5E[tableKey]?.[skillKey];
        const critTable = await fromUuid(critTableUUID);

        if (!critTable) return;

        const rollOutcome = await critTable.roll();
        const result = rollOutcome?.results?.[0];

        const chatData = {
            author: game.user?.id,
            speaker: ChatMessage.getSpeaker({ actor }),
            rolls: [rollOutcome.roll],
            system: {
                actorId: actor.uuid,
                actorName: actor.name,
                description: result?.text,
                img: critTable?.img,
                tableName: critTable?.name,
                tableId: critTable.uuid,
                resultTitle: result?.flags?.title,
            },
            type: "rollTableOutput",
        };

        ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));

        return ChatMessage.create(chatData);
    }

    async function toggleRollConfig() {
        showRollConfig = !showRollConfig;

        if (showRollConfig) {
            const messages = [...(game.messages ?? [])];
            const lastMessage = messages[messages.length - 1];

            if ($message.id === lastMessage?.id) {
                setTimeout(() => ui.chat.scrollBottom(), 0);
            }
        }
    }

    let hideSkillCriticalPrompt = game.settings.get("a5e", "hideSkillCriticalPrompt");

    let showRollConfig = false;

    const message = getContext("message");
    const actor = fromUuidSync($message?.system.actorId);
    const { user } = game;

    $: isCriticalFailure = determineIfCriticalFailure(roll);
    $: isCriticalSuccess = determineIfCriticalSuccess(roll);
</script>

<div class="roll-container">
    <div
        class="roll"
        class:roll--max={isCriticalSuccess}
        class:roll--min={isCriticalFailure}
        class:roll--wide={!isAction}
        data-tooltip={prepareRollTooltip($message, roll, rollData)}
        data-tooltip-class="a5e-tooltip a5e-tooltip--roll"
        data-tooltip-direction="LEFT"
    >
        {roll.total}
    </div>

    <header class="roll-header">
        <h3 class="roll-label">
            {rollData.label || "Result"}
        </h3>

        {#if !showRollConfig && (rollData.expertiseDice || rollData.rollMode || rollData.userLabel)}
            <div class="subtitle-wrapper">
                {#if rollData.rollMode}
                    <span
                        class="roll-mode"
                        class:roll-mode--disadvantage={rollData.rollMode === -1}
                    >
                        {getRollModeLabel(rollData)}
                    </span>
                {/if}

                {#if rollData.expertiseDice}
                    <span class="expertise-label">
                        {getExpertiseLabel(rollData)}
                    </span>
                {/if}

                {#if rollData.userLabel}
                    <span class="roll-sublabel">{rollData.userLabel}</span>
                {/if}
            </div>
        {/if}
    </header>

    {#if rollData.type === "damage" || rollData.type === "healing"}
        <DamageButtons {roll} {rollData} />
    {:else if (user.isGM || actor?.testUserPermission(user, 2)) && ["abilityCheck", "attack", "savingThrow", "skillCheck", "toolCheck"].includes(rollData.type)}
        <button
            class="roll-mode-button fa-dice fa-solid"
            on:click={toggleRollConfig}
            data-tooltip={"Modify Roll"}
            data-tooltip-direction="LEFT"
        />
    {/if}
</div>

{#if !hideSkillCriticalPrompt && rollData.type === "skillCheck" && rollData.skillKey}
    {#if isCriticalSuccess}
        <button on:click={() => rollOnSkillTable(rollData.skillKey, "critical")}>
            <i class="fa-solid fa-dice-d20"></i>
            Roll on the skill critical success table
        </button>
    {/if}

    {#if isCriticalFailure}
        <button on:click={() => rollOnSkillTable(rollData.skillKey, "fumble")}>
            <i class="fa-solid fa-dice-d20"></i>
            Roll on the skill critical failure table
        </button>
    {/if}
{/if}

{#if showRollConfig}
    <RollConfigurationOptions {rollData} on:toggleRollMode on:toggleExpertiseDice />
{/if}

<style lang="scss">
    .roll {
        position: relative;
        display: flex;
        flex-grow: 0;
        align-items: center;
        justify-content: center;
        height: 2.25rem;
        width: 2.5rem;
        font-size: var(--a5e-text-size-lg);
        font-weight: 700;
        border: 0.5px solid var(--a5e-roll-color, #ccc);
        border-radius: var(--a5e-border-radius-standard);
        cursor: pointer;

        &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--a5e-roll-color, rgba(0, 0, 0, 0.05));
            opacity: 0.3;
        }

        &--max {
            --a5e-roll-color: #97ae8f;
            color: #18520b;
        }

        &--min {
            --a5e-roll-color: #f0b5b5;
            color: #aa0200;
        }

        &--wide {
            width: 100%;
            height: 2rem;
        }
    }

    .roll-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .roll-header {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        text-align: left;
    }

    .roll-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        font-size: var(--a5e-text-size-sm);
        line-height: 1;
        font-weight: bold;
        border: 0;
    }

    .roll-mode-button {
        width: fit-content;
        margin: 0;
        margin-left: auto;
        padding: 0.25rem 0.375rem;
        font-size: var(--a5e-text-size-sm);
        line-height: 1;
        color: var(--a5e-color-text-medium);
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid #ccc;
        border-radius: var(--a5e-border-radius-standard);

        transition: var(--a5e-transition-standard);

        &:hover,
        &:focus {
            color: var(--a5e-color-text-dark);
            box-shadow: none;
        }
    }

    .expertise-label,
    .roll-mode {
        display: block;
        flex-shrink: 0;
        width: fit-content;
        padding: 0.075rem 0.3rem;
        font-size: var(--a5e-text-size-xs);
        line-height: 1;
        color: white;
        background: var(--a5e-color-primary);
        border: 1px solid var(--a5e-color-primary);
        border-radius: var(--a5e-border-radius-standard);
    }

    .roll-mode--disadvantage {
        border-color: #772020;
        background: var(--a5e-color-error);
    }

    .roll-sublabel {
        width: 100%;
        font-size: var(--a5e-text-size-xs);
        line-height: 1;
        color: var(--a5e-color-text-medium);
    }

    .subtitle-wrapper {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
</style>
