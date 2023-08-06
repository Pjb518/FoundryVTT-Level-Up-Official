<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext } from "svelte";

    import RollTooltip from "../tooltips/RollTooltip.svelte";
    import DamageButtons from "./DamageButtons.svelte";

    import getExpertiseDieSize from "../../../utils/getExpertiseDieSize";
    import RollConfigurationOptions from "./RollConfigurationOptions.svelte";

    export let roll;
    export let rollData = {};
    export let isAction = true;

    function isCriticalSuccess(roll) {
        const d20Roll = roll.terms.find((term) => term.faces === 20);

        if (!d20Roll) return false;

        return d20Roll.results.some(
            ({ result, active }) =>
                active && result >= (rollData.critThreshold ?? 20)
        );
    }

    function isCriticalFailure(roll) {
        const d20Roll = roll.terms.find((term) => term.faces === 20);

        if (!d20Roll) return false;

        return d20Roll.results.some(
            ({ result, active }) => active && result === 1
        );
    }

    function getRollModeLabel({ rollMode }) {
        if (!rollMode) return null;

        return localize(
            rollMode === 1
                ? "A5E.RollModeAdvantage"
                : "A5E.RollModeDisadvantage"
        );
    }

    function getExpertiseLabel({ expertiseDice }) {
        if (!expertiseDice) return null;

        return localize("A5E.ExpertiseDieSpecific", {
            dieSize: getExpertiseDieSize(expertiseDice),
        });
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

    async function toggleRollTooltip() {
        tooltipIsVisible = !tooltipIsVisible;

        if (tooltipIsVisible) {
            const messages = [...(game.messages ?? [])];
            const lastMessage = messages[messages.length - 1];

            if ($message.id === lastMessage?.id) {
                setTimeout(() => ui.chat.scrollBottom(), 0);
            }
        }
    }

    let tooltipIsVisible = false;
    let showRollConfig = false;

    const message = getContext("message");
    const actor = fromUuidSync($message?.flags?.a5e?.actorId);
</script>

<button class="roll-container" on:click={toggleRollTooltip}>
    <div
        class="roll"
        class:roll--max={isCriticalSuccess(roll)}
        class:roll--min={isCriticalFailure(roll)}
        class:roll--wide={!isAction}
    >
        {roll.total}
    </div>

    <header class="roll-header">
        <h3 class="roll-label">
            {rollData.label}
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
    {:else if (game.user.isGM || actor?.testUserPermission(game.user, 2)) && ["abilityCheck", "attack", "savingThrow", "skillCheck", "toolCheck"].includes(rollData.type)}
        <button
            class="roll-mode-button fa-dice fa-solid"
            on:click|stopPropagation={toggleRollConfig}
            data-tooltip={"Modify Roll"}
            data-tooltip-direction="LEFT"
        />
    {/if}
</button>

{#if showRollConfig}
    <RollConfigurationOptions
        {rollData}
        on:toggleRollMode
        on:toggleExpertiseDice
    />
{/if}

{#if tooltipIsVisible}
    <RollTooltip
        critThreshold={rollData.critThreshold}
        {roll}
        on:toggleTooltipVisibility={() =>
            (tooltipIsVisible = !tooltipIsVisible)}
    />
{/if}

<style lang="scss">
    .roll {
        display: flex;
        flex-grow: 0;
        align-items: center;
        justify-content: center;
        height: 2.25rem;
        width: 2.5rem;
        font-size: 1.2rem;
        font-weight: 700;
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid #ccc;
        border-radius: 3px;

        &--max {
            color: #18520b;
            background-color: #c7d0c0;
            border: 1px solid #97ae8f;
        }

        &--min {
            color: #aa0200;
            background-color: #ffdddd;
            border: 1px solid #f0b5b5;
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
        margin: 0;
        padding: 0;
        background: transparent;
        border: 0;
        box-shadow: none;

        &:hover {
            box-shadow: none;
        }
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
        font-size: 0.833rem;
        line-height: 1;
        font-weight: bold;
        border: 0;
    }

    .roll-mode-button {
        width: fit-content;
        margin: 0;
        margin-left: auto;
        padding: 0.25rem 0.375rem;
        font-size: 0.833rem;
        line-height: 1;
        color: #7e7960;
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid #ccc;
        border-radius: 3px;

        transition: all 0.15s ease-in-out;

        &:hover,
        &:focus {
            color: #191813;
            box-shadow: none;
        }
    }

    .expertise-label,
    .roll-mode {
        display: block;
        flex-shrink: 0;
        width: fit-content;
        padding: 0.075rem 0.3rem;
        font-size: 0.694rem;
        line-height: 1;
        color: white;
        background: #425f65;
        border: 1px solid #425f65;
        border-radius: 3px;
    }

    .roll-mode--disadvantage {
        border-color: #772020;
        background: #8b2525;
    }

    .roll-sublabel {
        width: 100%;
        font-size: 0.694rem;
        line-height: 1;
        color: #7e7960;
    }

    .subtitle-wrapper {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
</style>
