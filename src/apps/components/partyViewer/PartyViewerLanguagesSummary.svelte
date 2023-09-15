<script>
    import { localize } from "#runtime/svelte/helper";

    export let actor;
    export const propData = {};

    const { languages } = CONFIG.A5E;

    $: actorData = $actor?.system ?? {};

    $: knownLanguages = (actorData?.proficiencies?.languages ?? [])
        .map((language) => languages[language] ?? language)
        .sort((a, b) => a.localeCompare(b))
        .join(", ");
</script>

<span class="field field--languages">
    {#if knownLanguages}
        {knownLanguages}
    {:else}
        {localize("A5E.None")}
    {/if}
</span>

<style lang="scss">
    .field {
        text-align: left;
        margin-right: 0.25rem;

        &--languages {
            grid-area: languages;
        }
    }
</style>
