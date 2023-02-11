<script>
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import AbilityCheckHeader from "./header/AbilityCheckHeader.svelte";
    import RollTooltip from "./tooltip/RollTooltip.svelte";
    import SavingThrowHeader from "./header/SavingThrowHeader.svelte";
    import SkillCheckHeader from "./header/SkillCheckHeader.svelte";

    export let messageDocument;

    function getHeaderComponent(cardType) {
        if (cardType === "abilityCheck") return AbilityCheckHeader;
        else if (cardType === "savingThrow") return SavingThrowHeader;
        else if (cardType === "skillCheck") return SkillCheckHeader;
    }

    const message = new TJSDocument(messageDocument);
    const { cardType } = $message.flags?.a5e;

    let tooltipIsVisible = false;
    let headerComponent = getHeaderComponent(cardType);
</script>

<svelte:component this={headerComponent} {message} />

<hr class="a5e-rule a5e-rule--card" />

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#each $message.rolls as roll}
    <div
        class="a5e-roll a5e-js-toggle-roll-tooltip-visibility roll-formula"
        on:click={() => {
            tooltipIsVisible = !tooltipIsVisible;
        }}
    >
        {roll.formula}
    </div>

    {#each $message.rolls as rollComponent}
        {#if tooltipIsVisible}
            <RollTooltip roll={rollComponent} />
        {/if}
    {/each}

    <div class="a5e-roll a5e-roll--total">
        {$message.rolls[0].total}
    </div>
{/each}

<style lang="scss">
    .roll-formula {
        word-break: keep-all;
    }
</style>
