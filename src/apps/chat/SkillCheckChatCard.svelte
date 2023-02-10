<script>
    import { slide } from "svelte/transition";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let messageDocument;

    const message = new TJSDocument(messageDocument);
    const actor = new TJSDocument(fromUuidSync($message.flags?.a5e?.actorId));
    const { abilityKey, skillKey } = $message.flags?.a5e;
    const { abilities, skills } = CONFIG.A5E;

    let tooltipIsVisible = false;
</script>

<header class="card-header">
    <img class="actor-image" src={$actor.img} alt={$actor.name} />

    <div>
        <h2 class="card-title">{`${localize(skills[skillKey])} Check`}</h2>

        <h3 class="card-subtitle">
            {localize(abilities[abilityKey] ?? "No Ability Selected")}
        </h3>
    </div>
</header>

<hr class="a5e-rule a5e-rule--card" />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="a5e-roll a5e-js-toggle-roll-tooltip-visibility roll-formula"
    on:click={() => {
        tooltipIsVisible = !tooltipIsVisible;
    }}
>
    {$message.rolls[0].formula}
</div>

{#if tooltipIsVisible}
    <div
        class="a5e-dice-tooltip"
        in:slide={{ duration: 150 }}
        out:slide={{ duration: 150 }}
    >
        {#each $message.rolls[0].dice as part}
            <section class="u-mb-md">
                <header
                    class="u-align-center u-flex u-justify-space-between u-text-bold"
                >
                    <span class="a5e-dice-tooltip__formula">
                        {part.expression}
                    </span>

                    <span class="a5e-dice-tooltip__total">{part.total}</span>
                </header>

                <ol
                    class="u-align-center u-flex u-flex-wrap u-gap-xs u-list-style-none u-my-xs u-p-0"
                >
                    {#each part.results as roll}
                        <li
                            class={`a5e-die a5e-die--${part.faces}`}
                            class:discarded-die={roll.discarded}
                            class:fumbled-die={roll.result === 1}
                            class:critical-die={roll.result === part.faces}
                        >
                            {roll.result}
                        </li>
                    {/each}
                </ol>
            </section>
        {/each}
    </div>
{/if}

<div class="a5e-roll a5e-roll--total">
    {$message.rolls[0].total}
</div>

<style lang="scss">
    .actor-image {
        border: 0;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 4px;
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem;
        padding-bottom: 0;
    }

    .card-title {
        margin-bottom: 0;
        font-size: 1rem;
        font-weight: bold;
        border-bottom: 0;
    }

    .card-subtitle {
        margin-bottom: 0;
        font-size: 0.833rem;
        border-bottom: 0;
        color: #7e7960;
    }

    .discarded-die {
        filter: sepia(0.5) contrast(0.75) opacity(0.4);
    }

    .fumbled-die {
        color: #aa0200;
        filter: sepia(0.5) hue-rotate(-60deg);
    }

    .critical-die {
        color: #18520b;
        filter: sepia(0.5) hue-rotate(60deg);
    }

    .roll-formula {
        word-break: keep-all;
    }
</style>
