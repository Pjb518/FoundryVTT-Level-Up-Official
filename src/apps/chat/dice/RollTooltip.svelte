<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { slide } from "svelte/transition";

    import DieResult from "./DieResult.svelte";
    import RollFormula from "../dice/RollFormula.svelte";

    function getTooltipPermissions(message) {
        if (!game.settings.get("a5e", "protectRolls") ?? true) return true;

        const actorId = message?.flags?.a5e?.actorId;
        const actor = fromUuidSync(actorId);

        if (!actor) return true;
        if (actor.type === "character") return true;

        // If actor permissions are at least "Observer", show the tooltip
        return actor.permission >= 2;
    }

    export let critThreshold;
    export let roll;

    const message = getContext("message");
    const dispatch = createEventDispatcher();

    $: showTooltip = getTooltipPermissions($message);
</script>

{#if showTooltip}
    <div
        class="tooltip"
        in:slide={{ duration: 150 }}
        out:slide={{ duration: 150 }}
    >
        {#each roll.dice as part}
            <section class="u-mb-md">
                <header
                    class="u-align-center u-flex u-justify-space-between u-text-bold"
                >
                    <div class="a5e-dice-tooltip__formula tooltip-formula">
                        {part.expression}

                        <span class="tooltip-flavor">
                            {#if part.flavor}[{part.flavor}]{/if}
                        </span>
                    </div>

                    <span class="a5e-dice-tooltip__total">{part.total}</span>
                </header>

                <ol
                    class="u-align-center u-flex u-flex-wrap u-gap-xs u-list-style-none u-my-xs u-p-0"
                >
                    {#each part.results as { rerolled, discarded, result }}
                        <DieResult
                            dieSize={part.faces}
                            isCritical={(part.faces === 20 &&
                                result >= critThreshold) ||
                                result === part.faces}
                            isFumble={result === 1}
                            isDiscarded={discarded || rerolled}
                            {result}
                        />
                    {/each}
                </ol>
            </section>
        {/each}

        <RollFormula
            {roll}
            on:toggleTooltipVisibility={() =>
                dispatch("toggleTooltipVisibility")}
        />
    </div>
{/if}

<style lang="scss">
    .tooltip {
        width: 100%;
        flex-shrink: 0;
    }

    .tooltip-formula {
        display: flex;
        gap: 0.5rem;
    }

    .tooltip-flavor {
        font-size: 0.833rem;
        font-weight: normal;
        color: #7e7960;
    }
</style>
