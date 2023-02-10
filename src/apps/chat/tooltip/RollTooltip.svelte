<script>
    import { slide } from "svelte/transition";

    export let roll;
</script>

<div in:slide={{ duration: 150 }} out:slide={{ duration: 150 }}>
    {#each roll.dice as part}
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
                {#each part.results as die}
                    <li
                        class={`a5e-die a5e-die--${part.faces}`}
                        class:discarded-die={die.discarded}
                        class:fumbled-die={die.result === 1}
                        class:critical-die={die.result === part.faces}
                    >
                        {die.result}
                    </li>
                {/each}
            </ol>
        </section>
    {/each}
</div>
