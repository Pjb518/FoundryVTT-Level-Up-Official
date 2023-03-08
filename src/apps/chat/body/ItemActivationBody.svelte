<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let message;

    const { abilities } = CONFIG.A5E;

    $: description = $message.flags?.a5e?.description;
    $: prompts = $message.flags?.a5e?.prompts;

    $: savingThrowPrompts = prompts?.filter(
        ([_, prompt]) => prompt.type === "savingThrow"
    );

    console.log("PROMPTS!", $message.flags?.a5e?.prompts);
</script>

<article>
    {#if description}
        <hr class="a5e-rule a5e-rule--card" />

        {@html description}
    {/if}

    {#if savingThrowPrompts}
        <section class="prompt-button-wrapper">
            {#each savingThrowPrompts as [key, prompt]}
                <button>
                    <p>
                        {localize("A5E.RollPromptSavingThrow", {
                            ability: localize(abilities[prompt.ability]),
                            dc: prompt.dc,
                        })}
                    </p>
                </button>
            {/each}
        </section>
    {/if}
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding-top: 0.5rem;
    }

    .prompt-button-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
</style>
