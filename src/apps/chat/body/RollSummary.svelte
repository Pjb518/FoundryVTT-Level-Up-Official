<script>
    import Roll from "../dice/Roll.svelte";
    import RollTooltip from "../dice/RollTooltip.svelte";

    export let roll;
    export let rollData = {};

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

    let tooltipIsVisible = false;
</script>

<button
    class="roll-container"
    on:click={() => (tooltipIsVisible = !tooltipIsVisible)}
>
    <div class="roll-wrapper">
        <Roll
            {roll}
            {rollData}
            isCriticalFailure={isCriticalFailure(roll)}
            isCriticalSuccess={isCriticalSuccess(roll)}
        />
    </div>

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

    {#if rollData.type === "damage"}
        <button class="damage-button">
            <i class="fa-solid fa-heart-circle-minus" />
        </button>
    {:else if rollData.type === "healing"}
        <button class="healing-button">
            <i class="fa-solid fa-heart-circle-plus" />
        </button>
    {/if}
</button>

{#if tooltipIsVisible}
    <RollTooltip
        critThreshold={rollData.critThreshold}
        {roll}
        on:toggleTooltipVisibility={() =>
            (tooltipIsVisible = !tooltipIsVisible)}
    />
{/if}

<style lang="scss">
    .damage-button,
    .healing-button {
        width: fit-content;
        margin-left: auto;
        padding: 0.25rem;
        line-height: 1;

        i {
            margin: 0;
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
        gap: 0.125rem;
        text-align: left;
    }

    .roll-label {
        margin: 0;
        font-size: 0.833rem;
        line-height: 1;
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
        line-height: 1;
        color: #7e7960;
    }
</style>
