<header class="core-header">
    <i
        class="heading heading--exertion fa-solid fa-dumbbell"
        data-tooltip="Exertion"
        data-tooltip-direction="UP"
    />

    <i
        class="heading heading--spell-points fa-solid fa-hand-sparkles"
        data-tooltip="Spell Points"
        data-tooltip-direction="UP"
    />

    <div class="spell-slots">
        <h3 class="spell-slots__heading">Spell Slots by Level</h3>

        <ol class="spell-levels">
            {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as spellLevel}
                <li class="spell-level">{spellLevel}</li>
            {/each}
        </ol>
    </div>
</header>

<style lang="scss">
    .core-header {
        display: grid;
        grid-template-areas: var(--grid-areas);
        grid-template-columns: var(--grid-template);
        align-items: end;
        gap: 0.5rem;
        padding: 0.25rem 0.125rem;
        border-bottom: 1px solid #ccc;
        border-top: 1px solid #ccc;
    }

    .heading {
        font-size: 0.833rem;
        text-align: center;

        &--exertion {
            grid-area: exertion;
        }

        &--spell-points {
            grid-area: spellPoints;
        }
    }

    .spell-slots {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        grid-area: spellSlots;
        padding-top: 0.125rem;

        &__heading {
            font-size: 0.833rem;
            text-align: center;
            font-weight: 700;
        }
    }

    .spell-levels {
        display: flex;
        gap: 0.5rem;
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .spell-level {
        width: 1.75rem;
        text-align: center;
    }
</style>
