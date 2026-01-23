<script>
    let {
        highestSpellSlotLevel = 0,
        partyHasInspiration = false,
        partyHasExertionPool = false,
        partyHasArtifactCharges = false,
        partyHasSpellPointPool = false,
        partyHasSupply = false,
    } = $props();

    function getSpellLevels(highestSpellSlotLevel) {
        return Object.entries(CONFIG.A5E.spellLevels).filter(
            ([spellLevel]) =>
                spellLevel && spellLevel !== "0" && spellLevel <= highestSpellSlotLevel,
        );
    }
</script>

<header class="a5e-section-header a5e-section-header--party-viewer">
    {#if partyHasInspiration}
        <i
            class="heading heading--inspiration icon fa-solid fa-dice-d20"
            data-tooltip="Inspiration"
            data-tooltip-direction="UP"
        ></i>
    {/if}

    {#if partyHasExertionPool}
        <i
            class="heading heading--exertion icon fa-solid fa-dumbbell"
            data-tooltip="Exertion"
            data-tooltip-direction="UP"
        ></i>
    {/if}

    {#if partyHasSupply}
        <i
            class="heading heading--supply icon fa-solid fa-drumstick-bite"
            data-tooltip="Supply"
            data-tooltip-direction="UP"
        ></i>
    {/if}

    {#if partyHasArtifactCharges}
        <i
            class="heading heading--artifact-charges icon fa-solid fa-wand-sparkles"
            data-tooltip="Artifact Charges"
            data-tooltip-direction="UP"
        ></i>
    {/if}

    {#if partyHasSpellPointPool}
        <i
            class="heading heading--spell-points icon fa-solid fa-hand-sparkles"
            data-tooltip="Spell Points"
            data-tooltip-direction="UP"
        ></i>
    {/if}

    {#if highestSpellSlotLevel}
        <ol class="spell-levels">
            {#each getSpellLevels(highestSpellSlotLevel) as [spellLevel, tooltip]}
                <li
                    class="spell-level"
                    class:spell-level--narrow={highestSpellSlotLevel >= 8}
                    data-tooltip={`${tooltip} Spell Slots`}
                    data-tooltip-direction="UP"
                >
                    <span style="position:relative; z-index: 1;">
                        {spellLevel}
                    </span>
                </li>
            {/each}
        </ol>
    {/if}
</header>

<style lang="scss">
    .heading {
        font-size: var(--a5e-text-size-sm);
        text-align: center;

        &--artifact-charges {
            grid-area: artifactCharges;
        }

        &--exertion {
            grid-area: exertion;
        }

        &--inspiration {
            grid-area: inspiration;
        }

        &--spell-points {
            grid-area: spellPoints;
        }

        &--supply {
            grid-area: supply;
        }
    }

    .spell-levels {
        grid-area: spellSlots;
        display: flex;
        gap: 0.5rem;
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .spell-level {
        position: relative;
        width: 1.75rem;
        text-align: center;
        line-height: 1;

        &:before {
            content: "\e2ca";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: "Font Awesome 6 Pro";
            font-size: var(--a5e-text-size-md);
            color: rgba(255, 255, 255, 0.22);
        }

        &--narrow {
            width: 1.5rem;
        }
    }
</style>
