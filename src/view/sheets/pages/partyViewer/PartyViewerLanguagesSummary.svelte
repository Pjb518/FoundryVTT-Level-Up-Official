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

<span class="a5e-party-viewer__languages__field a5e-party-viewer__languages--grid-area">
    {#if knownLanguages}
        {knownLanguages}
    {:else}
        {localize("A5E.None")}
    {/if}
</span>
