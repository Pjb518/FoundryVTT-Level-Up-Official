<script>
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";

    import DieResult from "./DieResult.svelte";
    import RollFormula from "../dice/RollFormula.svelte";

    export let roll;

    const dispatch = createEventDispatcher();
</script>

<div in:slide={{ duration: 150 }} out:slide={{ duration: 150 }}>
    <RollFormula
        {roll}
        on:toggleTooltipVisibility={() => dispatch("toggleTooltipVisibility")}
    />

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
                        isCritical={result === part.faces}
                        isFumble={result === 1}
                        isDiscarded={discarded || rerolled}
                        {result}
                    />
                {/each}
            </ol>
        </section>
    {/each}
</div>

<style lang="scss">
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
