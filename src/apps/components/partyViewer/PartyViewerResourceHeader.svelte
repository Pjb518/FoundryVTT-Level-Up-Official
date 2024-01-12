<script>
    export let propData = {};

    function getSpellLevels({ highestSpellSlotLevel }) {
        return Object.entries(CONFIG.A5E.spellLevels).filter(
            ([spellLevel]) =>
                spellLevel &&
                spellLevel !== "0" &&
                spellLevel <= highestSpellSlotLevel,
        );
    }
</script>

<header class="a5e-section-header a5e-section-header--party-viewer">
    {#if propData.partyHasInspiration}
        <i
            class="heading heading--inspiration fa-solid fa-dice-d20"
            data-tooltip="Inspiration"
            data-tooltip-direction="UP"
        />
    {/if}

    {#if propData.partyHasExertionPool}
        <i
            class="heading heading--exertion fa-solid fa-dumbbell"
            data-tooltip="Exertion"
            data-tooltip-direction="UP"
        />
    {/if}

    {#if propData.partyHasSpellPointPool}
        <i
            class="heading heading--spell-points fa-solid fa-hand-sparkles"
            data-tooltip="Spell Points"
            data-tooltip-direction="UP"
        />
    {/if}

    {#if propData.highestSpellSlotLevel}
        <ol class="spell-levels">
            {#each getSpellLevels(propData) as [spellLevel, tooltip]}
                <li
                    class="spell-level"
                    class:spell-level--narrow={propData.highestSpellSlotLevel >=
                        8}
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
        font-size: 0.833rem;
        text-align: center;

        &--exertion {
            grid-area: exertion;
        }

        &--inspiration {
            grid-area: inspiration;
        }

        &--spell-points {
            grid-area: spellPoints;
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
            content: "\f72b";
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
