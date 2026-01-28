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
            class="a5e-party-viewer__resources__header a5e-party-viewer__resources__value--inspiration icon fa-solid fa-dice-d20"
            data-tooltip="Inspiration"
            data-tooltip-direction="UP"
        ></i>
    {/if}

    {#if partyHasExertionPool}
        <i
            class="a5e-party-viewer__resources__header a5e-party-viewer__resources__value--exertion icon fa-solid fa-dumbbell"
            data-tooltip="Exertion"
            data-tooltip-direction="UP"
        ></i>
    {/if}

    {#if partyHasSupply}
        <i
            class="a5e-party-viewer__resources__header a5e-party-viewer__resources__value--supply icon fa-solid fa-drumstick-bite"
            data-tooltip="Supply"
            data-tooltip-direction="UP"
        ></i>
    {/if}

    {#if partyHasArtifactCharges}
        <i
            class="a5e-party-viewer__resources__header a5e-party-viewer__resources__value--artifactCharges icon fa-solid fa-wand-sparkles"
            data-tooltip="Artifact Charges"
            data-tooltip-direction="UP"
        ></i>
    {/if}

    {#if partyHasSpellPointPool}
        <i
            class="a5e-party-viewer__resources__header a5e-party-viewer__resources__value--spellPoints icon fa-solid fa-hand-sparkles"
            data-tooltip="Spell Points"
            data-tooltip-direction="UP"
        ></i>
    {/if}

    {#if highestSpellSlotLevel}
        <ol class="a5e-party-viewer__resources__spell-levels">
            {#each getSpellLevels(highestSpellSlotLevel) as [spellLevel, tooltip]}
                <li
                    class="a5e-party-viewer__resources__spell-level"
                    class:a5e-party-viewer__resources__spell-level--narrow={highestSpellSlotLevel >=
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
