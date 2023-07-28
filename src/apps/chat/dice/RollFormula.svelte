<script>
    import { createEventDispatcher } from "svelte";

    export let roll;

    const dispatch = createEventDispatcher();
    const terseRollFormulae = game.settings.get("a5e", "terseRollFormulae");
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="roll-formula" on:click={() => dispatch("toggleTooltipVisibility")}>
    {#each roll.terms as term}
        <span class="roll-term">
            {term.expression}

            {#if term.flavor && !terseRollFormulae}
                [{term.flavor}]
            {/if}
        </span>
    {/each}
</div>

<style lang="scss">
    .roll-formula {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.25rem 0.5ch;
        min-height: 1.5rem;
        margin: 0 0 0.25rem;
        padding: 0.25rem;
        font-size: 0.833rem;
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid #ccc;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
    }

    .roll-term {
        white-space: nowrap;
    }
</style>
