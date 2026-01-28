<script lang="ts">
    const { skills } = CONFIG.A5E;
</script>

<header class="a5e-section-header a5e-section-header--party-viewer">
    {#each Object.entries(skills) as [abbreviation, tooltip]}
        <span
            class="a5e-party-viewer__skills__header a5e-party-viewer__skills__value--{abbreviation}"
            data-tooltip={tooltip}
            data-tooltip-direction="UP"
        >
            {abbreviation}
        </span>
    {/each}
</header>
