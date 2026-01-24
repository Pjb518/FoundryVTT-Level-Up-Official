<header class="a5e-section-header a5e-section-header--party-viewer">
    <i
        class="heading heading--hp icon fa-solid fa-heart"
        data-tooltip="Hit Points"
        data-tooltip-direction="UP"
    ></i>

    <i
        class="heading heading--ac icon fa-solid fa-shield"
        data-tooltip="Armor Class"
        data-tooltip-direction="UP"
    ></i>

    <i
        class="heading heading--maneuver-dc icon fa-solid fa-hand-fist"
        data-tooltip="Maneuver DC"
        data-tooltip-direction="UP"
    ></i>

    <i
        class="heading heading--spell-dc icon fa-solid fa-wand-sparkles"
        data-tooltip="Spell DC"
        data-tooltip-direction="UP"
    ></i>

    <i
        class="heading heading--perception icon fa-solid fa-eye"
        data-tooltip="Passive Perception"
        data-tooltip-direction="UP"
    ></i>

    <i
        class="heading heading--insight icon fa-solid fa-brain"
        data-tooltip="Passive Insight"
        data-tooltip-direction="UP"
    ></i>

    <i
        class="heading heading--investigation icon fa-solid fa-magnifying-glass"
        data-tooltip="Passive Investigation"
        data-tooltip-direction="UP"
    ></i>

    <i
        class="heading heading--xp icon fa-solid fa-person-arrow-up-from-line"
        data-tooltip="XP To Level"
        data-tooltip-direction="UP"
    ></i>
</header>

<style lang="scss">
    .heading {
        font-size: var(--a5e-text-size-sm);
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

        &--xp {
            grid-area: xp;
        }
    }
</style>
