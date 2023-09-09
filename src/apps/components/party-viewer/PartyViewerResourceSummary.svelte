<script>
    export let actor;

    $: actorData = $actor?.system ?? {};
</script>

<span class="field field--exertion">
    {actorData?.attributes.exertion.current} / {actorData?.attributes.exertion
        .max}
</span>

<span class="field field--spell-points">
    {actorData?.spellResources.points.current} / {actorData?.spellResources
        .points.max}
</span>

<style lang="scss">
    .field {
        text-align: center;
        margin-inline: 0.25rem;
    }
</style>
