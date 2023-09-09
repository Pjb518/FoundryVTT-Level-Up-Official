<script>
    export let actor;

    $: actorData = $actor?.system;
</script>

<span class="field field--hp">
    {actorData?.attributes?.hp.value} / {actorData?.attributes?.hp.max}
</span>

<span class="field field--ac">
    {actorData?.attributes?.ac.value}
</span>

<span class="field field--perception">
    {actorData?.skills?.prc.passive}
</span>

<span class="field field--insight">
    {actorData?.skills?.ins.passive}
</span>

<span class="field field--investigation">
    {actorData?.skills?.inv.passive}
</span>

<span class="field field--stealth">
    {actorData?.skills?.ste.passive}
</span>

<style lang="scss">
    .field {
        text-align: center;

        &--ac {
            grid-area: ac;
        }

        &--hp {
            grid-area: hp;
        }
    }
</style>
