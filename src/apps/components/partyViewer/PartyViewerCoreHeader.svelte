<header class="a5e-section-header a5e-section-header--party-viewer">
    <i
        class="heading heading--hp fa-solid fa-heart"
        data-tooltip="Hit Points"
        data-tooltip-direction="UP"
    />

    <i
        class="heading heading--ac fa-solid fa-shield"
        data-tooltip="Armor Class"
        data-tooltip-direction="UP"
    />

    <i
        class="heading heading--maneuver-dc fa-solid fa-hand-fist"
        data-tooltip="Maneuver DC"
        data-tooltip-direction="UP"
    />

    <i
        class="heading heading--spell-dc fa-solid fa-wand-sparkles"
        data-tooltip="Spell DC"
        data-tooltip-direction="UP"
    />

    <i
        class="heading heading--perception fa-solid fa-eye"
        data-tooltip="Passive Perception"
        data-tooltip-direction="UP"
    />

    <i
        class="heading heading--insight fa-solid fa-brain"
        data-tooltip="Passive Insight"
        data-tooltip-direction="UP"
    />

    <i
        class="heading heading--investigation fa-solid fa-magnifying-glass"
        data-tooltip="Passive Investigation"
        data-tooltip-direction="UP"
    />
</header>

<style lang="scss">
    .heading {
        font-size: 0.833rem;
        text-align: center;

        &--ac {
            grid-area: ac;
        }

        &--hp {
            grid-area: hp;
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
    }
</style>
