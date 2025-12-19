<script lang="ts">
    import { getContext } from "svelte";

    import { filterItems } from "#utils/view/filterItems.ts";
    import { prepareSpellBooks } from "#utils/view/helpers/prepareSpellBooks.ts";

    import { GenericConfigDialog } from "#view/dialogs/initializers/GenericConfigDialog.svelte.ts";
    import { DeletionConfirmationDialog } from "#view/dialogs/initializers/DeletionConfirmationDialog.svelte.ts";

    import { actorSheetTempSettings } from "#stores/ActorSheetTempSettingsStore.svelte.ts";

    import SpellBook from "../components/actor/SpellBook.svelte";
    import SpellBookConfig from "../components/actor/SpellBookConfig.svelte";
    import UtilityBar from "#view/snippets/UtilityBar.svelte";
    import createItem from "#utils/createItem.ts";
    import ShowDescription from "../../../apps/components/actorUtilityBar/ShowDescription.svelte";

    async function addSpellBook() {
        const initialSpellBookQuantity = Object.keys(actorStore.spellBooks ?? {}).length;

        const newSpellBookId = await actor.spellBooks.add({});

        if (initialSpellBookQuantity === 0) {
            updateCurrentSpellBook(newSpellBookId);
        } else {
            // biome-ignore lint/correctness/noSelfAssign: <explanation>
            currentSpellBook = currentSpellBook;
        }

        configureSpellBook(newSpellBookId);
    }

    async function configureSpellBook(spellBookId: string) {
        const dialog = new GenericConfigDialog(
            actor,
            "Configure Spell Book",
            SpellBookConfig,
            { spellBookId },
        );

        await dialog.render(true);
    }

    async function deleteSpellBook(spellBookId: string) {
        const initialSpellBookQuantity = Object.keys(
            actor.system.spellBooks ?? {},
        ).length;

        const dialog = new DeletionConfirmationDialog(undefined, false, "SpellBook");
        await dialog.render(true);

        const { confirmDeletion } = await dialog.promise;

        if (!confirmDeletion) return;
        console.log("Here");

        actor.spellBooks.remove(spellBookId);

        if (initialSpellBookQuantity === 1) {
            updateCurrentSpellBook(null);
        }

        if (currentSpellBook === spellBookId) {
            const firstSpellBook = Object.keys(actor.system.spellBooks ?? {})?.[0];

            updateCurrentSpellBook(firstSpellBook);
        }
    }

    function sortHandler(reverse: boolean) {
        sheet._sortEmbeddedAlphabetically(items, "Item", reverse);
    }

    function updateCurrentSpellBook(spellBookId: string) {
        const { uuid } = actor;
        currentSpellBook = spellBookId;

        actorSheetTempSettings[uuid].currentSpellBook = spellBookId;
    }

    let actor: any = getContext("actor");
    let sheet: any = getContext("sheet");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let filterOptions = $state({
        searchTerm: "",
        searchDescription: false,
        page: "spells",
    });

    let actorStore = $derived(actor.reactive.system);
    let items = $derived(filterItems(actor.reactive, "spell", filterOptions));
    let itemsBySpellBook = $derived(prepareSpellBooks(actor.reactive, items));

    const openCompendium = game.a5e.utils.openCompendium;

    let spellBooks = $derived(actor.reactive.spellBooks);
    let showDescription = $state(false);

    let currentSpellBook = $derived(
        actorSheetTempSettings[actor.uuid]?.currentSpellBook ??
            Object.keys(actorStore.spellBooks ?? {})?.[0],
    );

    let spellLevels = Object.entries(CONFIG.A5E.spellLevels) as string[][];
</script>

{#if actor.isOwner}
    <UtilityBar
        bind:filterOptions
        showAddIcon={true}
        addIconOptions={spellLevels}
        showDescriptionButton={true}
        showSearchDescriptionButton={true}
        bind:showDescription
        showFilters={true}
        showSortButton={true}
        {sortHandler}
        onAddIconClick={(subType) => createItem(actor, "spell", subType)}
    >
        <button
            class="a5e-button a5e-button--transparent"
            data-tooltip="Import Spells from Compendium"
            data-tooltip-direction="UP"
            aria-label="Import Spells from Compendium"
            onclick={() => openCompendium(actor, "spells")}
        >
            <i class="fa-solid fa-download"></i>
        </button>
    </UtilityBar>
{/if}

{#if !sheetIsLocked() || [...spellBooks].length > 1}
    <nav class="a5e-spellbook-list">
        {#each [...spellBooks] as [spellBookId, spellBook], idx}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="a5e-spellbook-list__item"
                class:a5e-spellbook-list__item--active={currentSpellBook
                    ? currentSpellBook === spellBookId
                    : idx === 0}
                onclick={() => updateCurrentSpellBook(spellBookId)}
            >
                {spellBook.name}

                {#if !sheetIsLocked()}
                    <button
                        class="a5e-button a5e-button--transparent a5e-control-button"
                        data-tooltip="Configure Spell Book"
                        aria-label="Configure Spell Book"
                        onclick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            configureSpellBook(spellBookId);
                        }}
                    >
                        <i class="fa-solid fa-gear"> </i>
                    </button>

                    <button
                        class="a5e-button a5e-button--transparent a5e-control-button"
                        data-tooltip="Delete Spell Book"
                        aria-label="Delete Spell Book"
                        onclick={(e) => {
                            console.log(e);
                            e.stopPropagation();
                            e.preventDefault();
                            deleteSpellBook(spellBookId);
                        }}
                    >
                        <i class="fa-solid fa-trash"> </i>
                    </button>
                {/if}
            </div>
        {/each}

        {#if !sheetIsLocked()}
            <button
                class="a5e-spellbook-list__item a5e-spellbook-list__item--add"
                data-tooltip="Create New Spell Book"
                aria-label="Create New Spell Book"
                onclick={() => addSpellBook()}
            >
                <i class="fa-solid fa-plus"></i>
            </button>
        {/if}
    </nav>
{/if}

{#if currentSpellBook && itemsBySpellBook[currentSpellBook]}
    <SpellBook
        spellBookId={currentSpellBook}
        items={itemsBySpellBook[currentSpellBook]}
        bind:showDescription
    />
{/if}

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .a5e-spellbook-list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.375rem;
        font-size: var(--a5e-sm-text);
        font-family: var(--a5e-secondary-font);
        margin: 0;
        padding: 0;
        margin-bottom: 0.25rem;
        list-style: none;

        &__item {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            width: fit-content;
            margin: 0;
            padding: 0.25rem 0.5rem;
            font-size: inherit;
            font-family: inherit;
            line-height: 1;
            background: var(--a5e-background-medium);
            color: var(--a5e-text-color-dark);
            border: 1px solid var(--a5e-border-color);
            border-radius: var(--a5e-border-radius-standard);

            &:focus,
            &:hover {
                box-shadow: none;
            }

            &--active {
                background-color: var(--a5e-color-primary);
                border-color: hsl(190, 21%, 28%);
                color: hsl(190, 21%, 100%);
            }

            &--add {
                min-width: 2rem;
                font-size: var(--a5e-sm-text);
                font-family: "Font Awesome Pro 6";
            }
        }
    }

    .a5e-control-button {
        margin: 0;
        padding: 0;
        transition: var(--a5e-transition-standard);
        color: inherit;

        &:hover {
            transform: scale(1.2);
        }
    }

    .recharge-button {
        flex-grow: 0;
        width: fit-content;
        padding: 0;
        margin: 0;
        margin-left: 0.25rem;
        background: none;
        color: #999;
        border: 0;

        transition: var(--a5e-transition-standard);

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }
</style>
