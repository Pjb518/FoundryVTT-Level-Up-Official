<script>
    import getRequiredExperiencePoints from "#utils/getRequiredExperiencePoints.ts";

    let { actor, propData = {} } = $props();

    function convertToPercentage(value) {
        return `${value}%`;
    }

    function calculatePrimaryHPColor(hp) {
        const hpPercentage = Math.min((hp.value / hp.max) * 100, 100);
        return `hsl(${Math.round(hpPercentage)}, 50%, 35%)`;
    }

    function calculateTotalHPPercentage(hp) {
        const tempHP = hp.temp || 0;

        return Math.min(((hp.value + (hp.temp || 0)) / (hp.max + tempHP)) * 100, 100);
    }

    function calculateXPToLevel() {
        const requiredXP = getRequiredExperiencePoints(actor);

        return Math.max(requiredXP - actor?.system?.details.xp, 0);
    }

    const actorData = $derived(actor?.system);
    const isBloodied = $derived(
        actor?.system?.attributes.hp.max / 2 >= actor?.system?.attributes.hp.value,
    );

    const hp = $derived(actor?.system?.attributes.hp);
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

<span class="a5e-party-viewer__core__summary a5e-party-viewer__core__value--maneuverDC">
    {actorData?.attributes.maneuverDC}
</span>

<span class="a5e-party-viewer__core__summary a5e-party-viewer__core__value--spellDC">
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
