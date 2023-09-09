<script>
    export let actor;

    $: actorData = $actor?.system;
</script>

<span class="field field--hp">
    {actorData?.attributes.hp.value} / {actorData?.attributes.hp.max}
</span>

<span class="field field--ac">
    {actorData?.attributes.ac.value}
</span>

<span class="field field--maneuver-dc">
    {actorData?.attributes.maneuverDC}
</span>

<span class="field field--spell-dc">
    {actorData?.attributes.spellDC}
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

<style lang="scss">
    .field {
        text-align: center;
        margin-inline: 0.25rem;

        &--ac {
            grid-area: ac;
        }

        &--hp {
            grid-area: hp;
            margin-inline: 0;
        }

        &--insight {
            grid-area: insight;
        }

        &--investigation {
            grid-area: investigation;
        }

        &--maneuver-dc {
            grid-area: maneuverDC;
        }

        &--perception {
            grid-area: perception;
        }

        &--spell-dc {
            grid-area: spellDC;
        }

        // &--highlight {
        //     background: #425f65;
        //     color: white;
        //     border: 1px solid #425f65;
        //     border-radius: 3px;
        // }
    }
</style>
