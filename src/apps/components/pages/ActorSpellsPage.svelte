<script>
    import { localize } from "#runtime/util/i18n";
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import GenericConfigDialog from "../../dialogs/initializers/GenericConfigDialog";

    import TabFooter from "../TabFooter.svelte";
    import SpellBook from "../SpellBook.svelte";
    import SpellbookConfigDialog from "../../dialogs/SpellbookConfigDialog.svelte";
    import SpellbookDeletionConfirmationDialog from "../../dialogs/initializers/SpellbookDeletionConfirmationDialog";

    import ActorSheetTempSettingsStore from "../../../stores/ActorSheetTempSettingsStore";
    import getMaxPreparedSpells from "../../../utils/getMaxPreparedSpells";

    const actor = getContext("actor");
    let { spells } = actor;

    async function addSpellBook() {
        const initialSpellBookQuantity = Object.keys(
            $actor.system.spellBooks ?? {},
        ).length;

        const newSpellBookId = await $actor.spellBooks.add({});
        spells.initialize(); // Manually refresh reducer

        if (initialSpellBookQuantity === 0) {
            updateCurrentSpellBook(newSpellBookId);
        } else {
            // biome-ignore lint/correctness/noSelfAssign: <explanation>
            currentSpellBook = currentSpellBook; // This is stupid, but it works
        }

        configureSpellbook(newSpellBookId);
    }

    async function configureSpellbook(spellBookId) {
        const dialog = new GenericConfigDialog(
            $actor,
            "Configure Spell Book",
            SpellbookConfigDialog,
            {
                spellBookId,
            },
        );

        await dialog.render(true);
    }

    async function deleteSpellbook(spellBookId) {
        const initialSpellBookQuantity = Object.keys(
            $actor.system.spellBooks ?? {},
        ).length;

        const dialog = new SpellbookDeletionConfirmationDialog();
        await dialog.render(true);

        const { confirmDeletion } = await dialog.promise;

        if (!confirmDeletion) return;

        $actor.spellBooks.remove(spellBookId);

        if (initialSpellBookQuantity === 1) {
            updateCurrentSpellBook(null);
        }

        if (currentSpellBook === spellBookId) {
            const firstSpellBook = Object.keys($actor.system.spellBooks ?? {})?.[0];

            updateCurrentSpellBook(firstSpellBook);
        }
    }

    function getMaxSpellResource(type) {
        if ($actor.type !== "character") {
            return spellResources[type].max;
        }

        if (sheetIsLocked) return spellResources[type].max;
        return spellResources[type].override;
    }

    function updateCurrentSpellBook(spellBookId) {
        const { uuid } = $actor;
        currentSpellBook = spellBookId;

        ActorSheetTempSettingsStore.update((currentSettings) => ({
            ...currentSettings,
            [uuid]: {
                ...(currentSettings[uuid] ?? {}),
                currentSpellBook: spellBookId,
            },
        }));
    }

    function updateMaxSpellResource(type, value) {
        const key =
            $actor.type === "character"
                ? `system.spellResources.${type}.override`
                : `system.spellResources.${type}.max`;

        updateDocumentDataFromField($actor, key, value);
    }

    let tempSettings = {};

    ActorSheetTempSettingsStore.subscribe((store) => {
        tempSettings = store;
    });

    $: spellResources = $actor.system.spellResources;

    $: preparedSpellCount = $actor.items.filter((item) => {
        if (
            !item.system.prepared ||
            item.system.prepared === CONFIG.A5E.PREPARED_STATES.ALWAYS_PREPARED
        )
            return false;

        return true;
    }).length;

    $: maxPrepared = getMaxPreparedSpells($actor);

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : ($actor.flags?.a5e?.sheetIsLocked ?? true);

    $: spellBooks = $actor.spellBooks;

    $: artifactChargesMax = getMaxSpellResource(
        "artifactCharges",
        spellResources,
        sheetIsLocked,
    );

    $: spellInventionsMax = getMaxSpellResource(
        "inventions",
        spellResources,
        sheetIsLocked,
    );

    $: spellPointMax = getMaxSpellResource("points", spellResources, sheetIsLocked);

    $: exertion = $actor.system.attributes.exertion;

    $: startingClass = $actor.system.classes?.startingClass;

    let currentSpellBook =
        tempSettings[$actor?.uuid]?.currentSpellBook ??
        Object.keys($actor.system.spellBooks ?? {})?.[0];

    if (!$spells._books[currentSpellBook]) {
        spells.initialize();
    }
</script>

{#if !sheetIsLocked || [...spellBooks].length > 1}
    <nav class="a5e-spellbook-list">
        {#each [...spellBooks] as [spellBookId, spellBook], index}
            <button
                class="a5e-spellbook-list__item"
                class:a5e-spellbook-list__item--active={currentSpellBook
                    ? currentSpellBook === spellBookId
                    : index === 0}
                on:click={() => updateCurrentSpellBook(spellBookId)}
            >
                {spellBook.name}

                {#if !sheetIsLocked}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <i
                        class="a5e-control-button a5e-control-button--config fa-solid fa-gear"
                        on:click|stopPropagation={() => configureSpellbook(spellBookId)}
                    />

                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <i
                        class="a5e-control-button a5e-control-button--delete fa-solid fa-trash"
                        on:click|stopPropagation={() => deleteSpellbook(spellBookId)}
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
    <!-- This is needed to refresh filters-->
    {#key currentSpellBook}
        <SpellBook
            spellBookId={currentSpellBook}
            reducer={$spells._books[currentSpellBook]}
        />
    {/key}
{/if}

<TabFooter --padding-right="1rem">
    <!-- Prepared Spells Count -->
    {#if preparedSpellCount}
        <div
            class="u-flex u-flex-wrap u-align-center u-gap-md"
            data-tooltip="This number does not include spells which are marked as always prepared."
            data-tooltip-direction="UP"
        >
            <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">Spells Prepared:</h3>

            <span class="a5e-footer-group__input">
                {preparedSpellCount}
            </span>

            /

            <input
                class="a5e-footer-group__input"
                class:disable-pointer-events={!$actor.isOwner || sheetIsLocked}
                type="number"
                name="system.spellResources.maxPrepared"
                value={maxPrepared}
                placeholder="0"
                min="0"
                disabled={sheetIsLocked}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value),
                    )}
            />
        </div>
    {/if}

    <!-- Artifact Charges -->
    {#if $actor.spellBooks?.get(currentSpellBook)?.showArtifactCharges ?? false}
        <div class="u-flex u-flex-wrap u-align-center u-gap-md">
            <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                {localize("A5E.spells.spellcasting.artifactCharges")}
            </h3>

            <input
                class="a5e-footer-group__input"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.spellResources.artifactCharges.current"
                value={spellResources.artifactCharges.current}
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
                name="system.spellResources.artifactCharges.max"
                value={artifactChargesMax ?? 0}
                disabled={sheetIsLocked}
                placeholder="0"
                min="0"
                on:change={({ target }) =>
                    updateMaxSpellResource("artifactCharges", Number(target.value))}
            />
        </div>
    {/if}

    <!-- Spell Inventions -->
    {#if $actor.spellBooks?.get(currentSpellBook)?.showSpellInventions ?? false}
        <div class="u-flex u-flex-wrap u-align-center u-gap-md">
            <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                {localize("A5E.spells.spellcasting.inventions")}
            </h3>

            <!-- <input
                class="a5e-footer-group__input"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.spellResources.inventions.current"
                value={spellResources.inventions.current}
                placeholder="0"
                min="0"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value),
                    )}
            />
            / -->
            <input
                class="a5e-footer-group__input"
                type="number"
                name="system.spellResources.inventions.max"
                value={spellInventionsMax ?? 0}
                disabled={sheetIsLocked}
                placeholder="0"
                min="0"
                on:change={({ target }) =>
                    updateMaxSpellResource("inventions", Number(target.value))}
            />
        </div>
    {/if}

    <!-- Spell Points -->
    {#if startingClass !== "psyknight"}
        {#if $actor.spellBooks?.get(currentSpellBook)?.showSpellPoints ?? false}
            <div class="u-flex u-flex-wrap u-align-center u-gap-md">
                <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                    {localize("A5E.spells.spellcasting.points")}
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
                    value={spellPointMax ?? 0}
                    disabled={sheetIsLocked}
                    placeholder="0"
                    min="0"
                    on:change={({ target }) =>
                        updateMaxSpellResource("points", Number(target.value))}
                />

                {#if spellResources.points.current < spellPointMax && spellPointMax && startingClass === "psion"}
                    <button
                        class="recharge-button"
                        data-tooltip="A5E.psionicDisciplines.rechargeFromHitDice"
                        data-tooltip-direction="UP"
                        on:click={() => $actor.recoverPsionicPointsUsingHitDice()}
                    >
                        <i class="fa-solid fa-brain" />
                    </button>
                {/if}
            </div>
        {/if}
    {:else}
        <div class="u-flex u-align-center u-gap-md">
            <h3 class="u-mb-0 u-text-sm u-text-bold">
                {localize("A5E.exertion.pool")}
            </h3>

            <input
                class="a5e-footer-group__input"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.attributes.exertion.current"
                value={exertion.current}
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
                name="system.attributes.exertion.max"
                value={exertion.max}
                disabled={$actor.automationAvailable}
                placeholder="0"
                min="0"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value),
                    )}
            />

            {#if exertion.current < exertion.max && exertion.max}
                <button
                    class="recharge-button"
                    data-tooltip="A5E.exertion.rechargeFromHitDice"
                    data-tooltip-direction="UP"
                    on:click={() => $actor.recoverExertionUsingHitDice()}
                >
                    <i class="fa-solid fa-bolt" />
                </button>
            {/if}
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
        font-size: var(--a5e-text-size-sm);
        font-family: var(--a5e-font-serif);
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
            padding: 0.25rem 0.5rem;
            font-size: inherit;
            font-family: inherit;
            line-height: 1;
            background: var(--a5e-color-background-medium);
            color: var(--a5e-color-text-dark);
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
                font-size: var(--a5e-text-size-md);
                font-family: "Font Awesome Pro 6";
            }
        }
    }

    .a5e-control-button {
        margin: 0;
        padding: 0;
        transition: var(--a5e-transition-standard);

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
