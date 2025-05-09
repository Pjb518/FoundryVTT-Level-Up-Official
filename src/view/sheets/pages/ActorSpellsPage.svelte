<script lang="ts">
    import { getContext } from "svelte";

    import { filterItems } from "#utils/view/filterItems.ts";
    import { getMaxPreparedSpells } from "#utils/getMaxPreparedSpells.ts";
    import { groupItemsByType } from "#utils/view/groupItemsByType.ts";
    import { prepareSpellBooks } from "#utils/view/helpers/prepareSpellBooks.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import { actorSheetTempSettings } from "#stores/ActorSheetTempSettingsStore.svelte.ts";

    import ItemCategory from "../components/ItemCategory.svelte";
    import SpellBook from "../components/SpellBook.svelte";
    import UtilityBar from "../../snippets/UtilityBar.svelte";

    async function addSpellBook() {
        const initialSpellBookQuantity = Object.keys(
            actorStore.spellBooks ?? {},
        ).length;

        const newSpellBookId = await $actor.spellBooks.add({});

        if (initialSpellBookQuantity === 0) {
            updateCurrentSpellBook(newSpellBookId);
        } else {
            // biome-ignore lint/correctness/noSelfAssign: <explanation>
            currentSpellBook = currentSpellBook;
        }
    }

    async function configureSpellBook(spellBookId: string) {
        const dialog = new GenericConfigDialog(
            actor,
            "Configure Spell Book",
            SpellBookConfigDialog,
            { spellBookId },
        );

        await dialog.render(true);
    }

    async function deleteSpellBook(spellBookId: string) {
        const initialSpellBookQuantity = Object.keys(
            actor.system.spellBooks ?? {},
        ).length;

        const dialog = new SpellBookDeletionConfirmationDialog();
        await dialog.render(true);

        const { confirmDeletion } = await dialog.promise;

        if (!confirmDeletion) return;

        actor.spellBooks.remove(spellBookId);

        if (initialSpellBookQuantity === 1) {
            updateCurrentSpellBook(null);
        }

        if (currentSpellBook === spellBookId) {
            const firstSpellBook = Object.keys(
                actor.system.spellBooks ?? {},
            )?.[0];

            updateCurrentSpellBook(firstSpellBook);
        }
    }

    function getMaxSpellResource(type: string) {
        if (actor.type !== "character") {
            return spellResources[type].max;
        }

        if (sheetIsLocked()) return spellResources[type].max;
        return spellResources[type].override;
    }

    function updateCurrentSpellBook(spellBookId: string) {
        const { uuid } = actor;
        currentSpellBook = spellBookId;

        actorSheetTempSettings[uuid].currentSpellBook = spellBookId;
    }

    function updateMaxSpellResource(type: string, value: number) {
        const key =
            actor.type === "character"
                ? `system.spellResources.${type}.override`
                : `system.spellResources.${type}.max`;

        updateDocumentDataFromField(actor, key, value);
    }

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let actorStore = $derived(actor.reactive.system);
    let items = $derived(filterItems(actor.reactive, "spell"));
    let itemsBySpellBook = $derived(prepareSpellBooks(actor.reactive, items));

    const openCompendium = game.a5e.utils.openCompendium;

    let spellResources = $derived(actor.reactive.system.spellResources);
    let preparedSpellCount = $derived(
        () =>
            actor.reactive.items.filter((item) => {
                if (
                    !item.system.prepared ||
                    item.system.prepare ===
                        CONFIG.A5E.PREPARED_STATES.ALWAYS_PREPARED
                ) {
                    return false;
                }

                return true;
            }).length,
    );

    let maxPrepared = $derived(getMaxPreparedSpells(actor.reactive));
    let spellBooks = $derived(actor.reactive.spellBooks);

    let maxArtifactCharges = $derived(getMaxSpellResource("artifactCharges"));
    let maxSpellInventions = $derived(getMaxSpellResource("inventions"));
    let maxSpellPoints = $derived(getMaxSpellResource("points"));

    let exertion = $derived(actorStore.attributes.exertion);
    let startingClass = $derived(actorStore.classes?.startingClass);

    let currentSpellBook = $derived(
        actorSheetTempSettings[actor.uuid]?.currentSpellBook ??
            Object.keys(actorStore.spellBooks ?? {})?.[0],
    );
</script>

{#if !sheetIsLocked() || [...spellBooks].length > 1}
    <nav class="a5e-spellbook-list">
        {#each [...spellBooks] as [spellBookId, spellBook], idx}
            <button
                class="a5e-button a5e-spellbook-list__item"
                class:a5e-spellbook-list__item--active={currentSpellBook
                    ? currentSpellBook === spellBookId
                    : idx === 0}
                onclick={() => updateCurrentSpellBook(spellBookId)}
            >
                {spellBook.name}

                {#if !sheetIsLocked()}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <i
                        class="a5e-control-button a5e-control-button--config fa-solid fa-gear"
                        onclick={(e) => {
                            e.stopPropagation();
                            configureSpellBook(spellBookId);
                        }}
                    >
                    </i>

                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <i
                        class="a5e-control-button a5e-control-button--config fa-solid fa-trash"
                        onclick={(e) => {
                            e.stopPropagation();
                            deleteSpellBook(spellBookId);
                        }}
                    >
                    </i>
                {/if}
            </button>
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
    />
{/if}
