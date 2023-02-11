<script>
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import AbilityCheckHeader from "./header/AbilityCheckHeader.svelte";
    import RollFormula from "./tooltip/RollFormula.svelte";
    import RollTooltip from "./tooltip/RollTooltip.svelte";
    import SavingThrowHeader from "./header/SavingThrowHeader.svelte";
    import SkillCheckHeader from "./header/SkillCheckHeader.svelte";

    export let messageDocument;

    function getHeaderComponent(cardType) {
        if (cardType === "abilityCheck") return AbilityCheckHeader;
        else if (cardType === "savingThrow") return SavingThrowHeader;
        else if (cardType === "skillCheck") return SkillCheckHeader;
    }

    function isCriticalSuccess(roll) {
        const d20Roll = roll.terms.find((term) => term.faces === 20);

        if (!d20Roll) return false;

        return d20Roll.results.some(
            ({ result, active }) => active && result === 20
        );
    }

    function isCriticalFailure(roll) {
        const d20Roll = roll.terms.find((term) => term.faces === 20);

        if (!d20Roll) return false;

        return d20Roll.results.some(
            ({ result, active }) => active && result === 1
        );
    }

    const message = new TJSDocument(messageDocument);
    const { cardType } = $message.flags?.a5e;

    let tooltipIsVisible = false;
    let headerComponent = getHeaderComponent(cardType);
</script>

<!-- TODO: Fix up the classes in this component -->

<svelte:component this={headerComponent} {message} />

<hr class="a5e-rule a5e-rule--card" />

{#each $message.rolls as roll}
    <RollFormula
        {roll}
        on:toggleTooltipVisibility={() =>
            (tooltipIsVisible = !tooltipIsVisible)}
    />

    {#each $message.rolls as rollComponent}
        {#if tooltipIsVisible}
            <RollTooltip roll={rollComponent} />
        {/if}
    {/each}

    <div
        class="a5e-roll a5e-roll--total"
        class:max={isCriticalSuccess(roll)}
        class:min={isCriticalFailure(roll)}
    >
        {roll.total}
    </div>
{/each}

<style class="scss">
    .max {
        color: #18520b;
        background-color: #c7d0c0;
        border: 1px solid #97ae8f;
    }

    .min {
        color: #aa0200;
        background-color: #ffdddd;
        border: 1px solid #f0b5b5;
    }
</style>
