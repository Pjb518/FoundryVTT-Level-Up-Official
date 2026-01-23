<script>
    import { localize } from "#utils/localization/localize.ts";

    let { actor, propData = {} } = $props();

    const { languages } = CONFIG.A5E;

    const actorData = $derived(actor?.system ?? {});

    const knownLanguages = $derived(
        (actorData?.proficiencies?.languages ?? [])
            .map((language) => languages[language] ?? language)
            .sort((a, b) => a.localeCompare(b))
            .join(", "),
    );
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
