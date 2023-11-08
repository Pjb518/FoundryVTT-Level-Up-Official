<script>
    export let actor;
    export let propData = {};

    function convertToPercentage(value) {
        return `${value}%`;
    }

    function calculatePrimaryHPColor(hp) {
        const hpPercentage = Math.min((hp.value / hp.max) * 100, 100);
        return `hsl(${Math.round(hpPercentage)}, 50%, 35%)`;
    }

    function calculateTotalHPPercentage(hp) {
        const tempHP = hp.temp || 0;

        return Math.min(
            ((hp.value + (hp.temp || 0)) / (hp.max + tempHP)) * 100,
            100
        );
    }

    $: actorData = $actor?.system;
    $: isBloodied =
        $actor?.system?.attributes.hp.max / 2 >=
        $actor?.system?.attributes.hp.value;

    $: hp = $actor?.system?.attributes.hp;
    $: totalHPPercentage = convertToPercentage(calculateTotalHPPercentage(hp));

    $: primaryHPColor = calculatePrimaryHPColor(hp);
</script>

<span
    class="field field--hp field--highlight-hp"
    style="
        --color-primary-hp-bar: {primaryHPColor};
        --total-hp-percentage: {totalHPPercentage};
    "
    data-tooltip={isBloodied ? `${$actor.name} is Bloodied` : null}
    data-tooltip-direction="UP"
>
    <span class="color-blend">
        {actorData?.attributes.hp.value} / {actorData?.attributes.hp.max}
    </span>
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

<span
    class="field field--perception"
    class:field--highlight={actorData?.skills?.prc.passive ===
        propData.highestPassiveScores.prc}
>
    {actorData?.skills?.prc.passive}
</span>

<span
    class="field field--insight"
    class:field--highlight={actorData?.skills?.ins.passive ===
        propData.highestPassiveScores.ins}
>
    {actorData?.skills?.ins.passive}
</span>

<span
    class="field field--investigation"
    class:field--highlight={actorData?.skills?.inv.passive ===
        propData.highestPassiveScores.inv}
>
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

        &--highlight {
            background: $color-primary;
            color: white;
            border: 1px solid darken($color-primary, 5%);
            border-radius: 3px;
        }

        &--highlight-hp {
            border-radius: 3px;
            color: white;
            text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
                1px 1px 0 #000;
            background: linear-gradient(
                90deg,
                var(--color-primary-hp-bar) var(--total-hp-percentage),
                transparent var(--total-hp-percentage)
            );
        }
    }
</style>
