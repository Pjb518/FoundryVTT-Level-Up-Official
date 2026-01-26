<script lang="ts">
    const { skills } = CONFIG.A5E;
</script>

<header class="a5e-section-header a5e-section-header--party-viewer">
    {#each Object.entries(skills) as [abbreviation, tooltip]}
        <span
            class="skill skill--{abbreviation}"
            data-tooltip={tooltip}
            data-tooltip-direction="UP"
        >
            {abbreviation}
        </span>
    {/each}
</header>

<style lang="scss">
    .skill {
        text-align: center;
        line-height: 1;
        text-transform: uppercase;

        &--acr {
            grid-area: acr;
        }
        &--ani {
            grid-area: ani;
        }
        &--arc {
            grid-area: arc;
        }
        &--ath {
            grid-area: ath;
        }
        &--cul {
            grid-area: cul;
        }
        &--dec {
            grid-area: dec;
        }
        &--eng {
            grid-area: eng;
        }
        &--his {
            grid-area: his;
        }
        &--ins {
            grid-area: ins;
        }
        &--inv {
            grid-area: inv;
        }
        &--itm {
            grid-area: itm;
        }
        &--med {
            grid-area: med;
        }
        &--nat {
            grid-area: nat;
        }
        &--per {
            grid-area: per;
        }
        &--prc {
            grid-area: prc;
        }
        &--prf {
            grid-area: prf;
        }
        &--rel {
            grid-area: rel;
        }
        &--sci {
            grid-area: sci;
        }
        &--slt {
            grid-area: slt;
        }
        &--ste {
            grid-area: ste;
        }
        &--sur {
            grid-area: sur;
        }
    }
</style>
