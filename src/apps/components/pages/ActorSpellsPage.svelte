<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext, onDestroy } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import GenericConfigDialog from "../../dialogs/initializers/GenericConfigDialog";

    import TabFooter from "../TabFooter.svelte";
    import SpellBook from "../SpellBook.svelte";
    import SpellbookConfigDialog from "../../dialogs/SpellbookConfigDialog.svelte";
    import SpellbookDeletionConfirmationDialog from "../../dialogs/initializers/SpellbookDeletionConfirmationDialog";

    const actor = getContext("actor");
    let { spells } = actor;

    async function addSpellBook() {
        await $actor.spellBooks.add({ ability: "default" });
        spells.initialize(); // Manually refresh reducer
        currentSpellBook = currentSpellBook; // This is stupid, but it works
    }

    async function configureSpellbook(spellBookId) {
        const dialog = new GenericConfigDialog(
            $actor,
            "Configure Spell Book",
            SpellbookConfigDialog,
            { spellBookId },
        );

        await dialog.render(true);
    }

    async function deleteSpellbook() {
        const dialog = new SpellbookDeletionConfirmationDialog();
        await dialog.render(true);

        const { confirmDeletion } = await dialog.promise;

        if (!confirmDeletion) return;

        $actor.spellBooks.remove(currentSpellBook);
    }

    $: spellResources = $actor.system.spellResources;

    $: preparedSpellCount = $actor.items.filter((item) => {
        if (item.type !== "spell") return false;
        if (
            !item.system.prepared ||
            item.system.prepared === CONFIG.A5E.PREPARED_STATES.ALWAYS_PREPARED
        )
            return false;

        return true;
    }).length;

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: spellBooks = $actor.spellBooks;
    $: currentSpellBook = [...spellBooks]?.[0]?.[0];
</script>

{#if !sheetIsLocked || [...spellBooks].length > 1}
    <nav class="a5e-spellbook-list">
        {#each [...spellBooks] as [spellBookId, spellBook]}
            <button
                class="a5e-spellbook-list__item"
                class:a5e-spellbook-list__item--active={currentSpellBook ===
                    spellBookId}
                on:click={() => {
                    currentSpellBook = spellBookId;
                }}
            >
                {spellBook.name}

                {#if !sheetIsLocked}
                    <i
                        class="a5e-control-button a5e-control-button--config fa-solid fa-gear"
                        on:click|stopPropagation={() =>
                            configureSpellbook(spellBookId)}
                    />

                    <i
                        class="a5e-control-button a5e-control-button--delete fa-solid fa-trash"
                        on:click|stopPropagation={deleteSpellbook}
                    />
                {/if}
            </button>
        {/each}

        {#if !sheetIsLocked}
            <button
                class="a5e-spellbook-list__item a5e-spellbook-list__item--add fa-solid fa-plus"
                data-tooltip="Create new spell book"
                on:click={() => addSpellBook()}
            />
        {/if}
    </nav>
{/if}

{#if currentSpellBook && $spells._books[currentSpellBook]}
    <SpellBook
        spellBookId={currentSpellBook}
        reducer={$spells._books[currentSpellBook]}
    />
{/if}

<TabFooter --padding-right="1rem">
    <!-- Prepared Spells Count -->
    {#if preparedSpellCount}
        <div
            class="u-flex u-flex-wrap u-align-center u-gap-md"
            data-tooltip="This number does not include spells which are marked as always prepared."
            data-tooltip-direction="UP"
        >
            <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                Spells Prepared:
            </h3>

            <span class="a5e-footer-group__input">
                {preparedSpellCount}
            </span>
        </div>
    {/if}

    <!-- Spell Points -->
    {#if $actor.flags.a5e?.showSpellPoints ?? false}
        <div class="u-flex u-flex-wrap u-align-center u-gap-md">
            <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                {localize("A5E.SpellPoints")}
            </h3>

            <input
                class="a5e-footer-group__input"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.spellResources.points.current"
                value={spellResources.points.current}
                placeholder="0"
                min="0"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value),
                    )}
            />
            /
            <input
                class="a5e-footer-group__input"
                type="number"
                name="system.spellResources.points.max"
                value={spellResources.points.max}
                placeholder="0"
                min="0"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value),
                    )}
            />
        </div>
    {/if}

    <!-- NPC Caster Level Configuration -->
    {#if $actor.type === "npc"}
        <div class="u-flex u-flex-wrap u-align-center u-gap-md">
            <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                {localize("A5E.CasterLevel")}
            </h3>

            <input
                class="a5e-footer-group__input"
                class:disable-pointer-events={!$actor.isOwner || sheetIsLocked}
                type="number"
                name="system.attributes.casterLevel"
                value={$actor.system.attributes.casterLevel}
                placeholder="0"
                min="0"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value),
                    )}
            />
        </div>
    {/if}
</TabFooter>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .a5e-spellbook-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        margin: 0;
        padding: 0;
        list-style: none;

        &__item {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            width: fit-content;
            margin: 0;
            padding: 0.375rem 0.75rem;
            line-height: 1;
            background: rgba(0 0 0 / 0.05);
            border: 1px solid #ccc;
            border-radius: 3px;

            &:focus,
            &:hover {
                box-shadow: none;
            }

            &--active {
                background-color: hsl(190, 21%, 33%);
                border-color: hsl(190, 21%, 28%);
                color: hsl(190, 21%, 100%);
            }

            &--add {
                min-width: 2rem;
            }
        }
    }

    .a5e-control-button {
        margin: 0;
        padding: 0;
        transition: all 0.15s ease-in-out;

        &:hover {
            transform: scale(1.2);
        }
    }
</style>
