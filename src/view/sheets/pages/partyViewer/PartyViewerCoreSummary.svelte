<script lang="ts">
    import getRequiredExperiencePoints from "#utils/getRequiredExperiencePoints.ts";

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
            100,
        );
    }

    function calculateXPToLevel() {
        const requiredXP = getRequiredExperiencePoints(actor);

        return Math.max(requiredXP - actorData?.details.xp, 0);
    }

    let { actor, propData = {} } = $props();

    const actorData = $derived(actor?.reactive?.system);
    const isBloodied = $derived(
        actorData?.attributes.hp.max / 2 >= actorData?.attributes.hp.value,
    );

    const hp = $derived(actorData?.attributes.hp);
    const totalHPPercentage = $derived(
        convertToPercentage(calculateTotalHPPercentage(hp)),
    );
    const primaryHPColor = $derived(calculatePrimaryHPColor(hp));
    const xpNeeded = $derived(calculateXPToLevel());
</script>

<span
    class="a5e-party-viewer__core__summary a5e-party-viewer__core__summary--hp a5e-party-viewer__core__value--hp a5e-party-viewer__core--highlight-hp"
    style="
        --color-primary-hp-bar: {primaryHPColor};
        --total-hp-percentage: {totalHPPercentage};
    "
    data-tooltip={isBloodied ? `${actor.name} is Bloodied` : null}
    data-tooltip-direction="UP"
>
    <span class="color-blend">
        {actorData?.attributes.hp.value} / {actorData?.attributes.hp.max}
    </span>
</span>

<span class="a5e-party-viewer__core__summary a5e-party-viewer__core__value--ac">
    {actorData?.attributes.ac.value}
</span>

<span
    class="a5e-party-viewer__core__summary a5e-party-viewer__core__value--maneuverDC"
>
    {actorData?.attributes.maneuverDC}
</span>

<span
    class="a5e-party-viewer__core__summary a5e-party-viewer__core__value--spellDC"
>
    {actorData?.attributes.spellDC}
</span>

<span
    class="a5e-party-viewer__core__summary a5e-party-viewer__core__value--perception"
    class:a5e-party-viewer__core--highlight={actorData?.skills?.prc.passive ===
        propData.highestPassiveScores.prc}
>
    {actorData?.skills?.prc.passive}
</span>

<span
    class="a5e-party-viewer__core__summary a5e-party-viewer__core__value--insight"
    class:fa5e-party-viewer__core--highlight={actorData?.skills?.ins.passive ===
        propData.highestPassiveScores.ins}
>
    {actorData?.skills?.ins.passive}
</span>

<span
    class="a5e-party-viewer__core__summary a5e-party-viewer__core__value--investigation"
    class:a5e-party-viewer__core--highlight={actorData?.skills?.inv.passive ===
        propData.highestPassiveScores.inv}
>
    {actorData?.skills?.inv.passive}
</span>

<span class="a5e-party-viewer__core__summary a5e-party-viewer__core__value--xp">
    {xpNeeded}
</span>
