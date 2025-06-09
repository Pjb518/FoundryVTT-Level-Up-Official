<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { getMaxPreparedSpells } from "#utils/getMaxPreparedSpells.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import { actorSheetTempSettings } from "#stores/ActorSheetTempSettingsStore.svelte.ts";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    function getMaxSpellResource(type: string) {
        if (actor.type !== "character") {
            return spellResources[type].max;
        }

        if (sheetIsLocked()) return spellResources[type].max;
        return spellResources[type].override;
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

    let preparedSpellCount = $derived(
        actor.reactive.items.filter((item) => {
            if (
                !item.system.prepared ||
                item.system.prepare ===
                    CONFIG.A5E.PREPARED_STATES.ALWAYS_PREPARED
            ) {
                return false;
            }

            return true;
        }).length || 5,
    );

    let spellResources = $derived(actorStore.system.spellResources);

    let maxPrepared = $derived(getMaxPreparedSpells(actor.reactive));

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

<!-- Prepared Spells Count -->
{#if preparedSpellCount}
    <FieldWrapper
        heading="Prepared Spells"
        headingTooltip="This number does not include spells which are marked as always prepared."
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
        --a5e-field-wrapper-gap="0.5rem"
    >
        <span
            class="a5e-footer-group__value a5e-footer-group__value--attunement"
        >
            {preparedSpellCount}
        </span>

        /

        <input
            class="a5e-input a5e-input--actor-footer"
            class:disable-pointer-events={!actor.isOwner || sheetIsLocked()}
            type="number"
            name="system.spellResources.maxPrepared"
            value={maxPrepared}
            placeholder="0"
            min="0"
            disabled={sheetIsLocked()}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    actor,
                    currentTarget.name,
                    Number(currentTarget.value),
                )}
        />
    </FieldWrapper>
{/if}

<!-- Artifact Charges -->
{#if actor.spellBooks?.get(currentSpellBook)?.showArtifactCharges ?? false}
    <FieldWrapper
        heading="A5e.spells.spellcasting.artifactCharges"
        headingTooltip="Number Of Available Charges."
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
        --a5e-field-wrapper-gap="0.5rem"
    >
        <input
            class="a5e-input a5e-input--actor-footer"
            class:disable-pointer-events={!actor.isOwner}
            type="number"
            name="system.spellResources.artifactCharges.current"
            value={spellResources.artifactCharges.current}
            placeholder="0"
            min="0"
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    actor,
                    currentTarget.name,
                    Number(currentTarget.value),
                )}
        />
        /
        <input
            class="a5e-input a5e-input--actor-footer"
            type="number"
            name="system.spellResources.artifactCharges.max"
            value={maxArtifactCharges ?? 0}
            disabled={sheetIsLocked()}
            placeholder="0"
            min="0"
            onchange={({ currentTarget }) =>
                updateMaxSpellResource(
                    "artifactCharges",
                    Number(currentTarget.value),
                )}
        />
    </FieldWrapper>
{/if}

<!-- Spell Inventions -->
{#if actor.spellBooks?.get(currentSpellBook)?.showSpellInventions ?? false}
    <FieldWrapper
        heading="A5e.spells.spellcasting.inventions"
        headingTooltip="Number Of Available Inventions."
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
        --a5e-field-wrapper-gap="0.5rem"
    >
        <!-- <input
               class="a5e-footer-group__input"
               class:disable-pointer-events={!actor.isOwner}
               type="number"
               name="system.spellResources.inventions.current"
               value={spellResources.inventions.current}
               placeholder="0"
               min="0"
               onchange={({ currentTarget }) =>
                   updateDocumentDataFromField(
                       actor,
                       currentTarget.name,
                       Number(currentTarget.value),
                   )}
           />
           / -->

        <input
            class="a5e-input a5e-input--actor-footer"
            type="number"
            name="system.spellResources.inventions.max"
            value={maxSpellInventions ?? 0}
            disabled={sheetIsLocked()}
            placeholder="0"
            min="0"
            onchange={({ currentTarget }) =>
                updateMaxSpellResource(
                    "inventions",
                    Number(currentTarget.value),
                )}
        />
    </FieldWrapper>
{/if}

<!-- Spell Points -->
{#if startingClass !== "psyknight"}
    {#if actor.spellBooks?.get(currentSpellBook)?.showSpellPoints ?? false}
        <FieldWrapper
            heading="A5e.spells.spellcasting.points"
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-item-alignment="center"
            --a5e-field-wrapper-gap="0.5rem"
        >
            <input
                class="a5e-input a5e-input--actor-footer"
                class:disable-pointer-events={!actor.isOwner}
                type="number"
                name="system.spellResources.points.current"
                value={spellResources.points.current}
                placeholder="0"
                min="0"
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        actor,
                        currentTarget.name,
                        Number(currentTarget.value),
                    )}
            />
            /
            <input
                class="a5e-input a5e-input--actor-footer"
                type="number"
                name="system.spellResources.points.max"
                value={maxSpellPoints ?? 0}
                disabled={sheetIsLocked()}
                placeholder="0"
                min="0"
                onchange={({ currentTarget }) =>
                    updateMaxSpellResource(
                        "points",
                        Number(currentTarget.value),
                    )}
            />

            {#if spellResources.points.current < maxSpellPoints && maxSpellPoints && startingClass === "psion"}
                <button
                    class="a5e-button a5e-button--transparent"
                    data-tooltip="A5E.psionicDisciplines.rechargeFromHitDice"
                    data-tooltip-direction="UP"
                    aria-label="A5E.psionicDisciplines.rechargeFromHitDice"
                    onclick={() => actor.recoverPsionicPointsUsingHitDice()}
                >
                    <i class="icon fa-solid fa-brain"></i>
                </button>
            {/if}
        </FieldWrapper>
    {/if}
{:else}
    <FieldWrapper
        heading="A5E.spells.spellcasting.psionicPoints"
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
        --a5e-field-wrapper-gap="0.5rem"
    >
        <input
            class="a5e-input a5e-input--actor-footer"
            class:disable-pointer-events={!actor.isOwner}
            type="number"
            name="system.attributes.exertion.current"
            value={exertion.current}
            placeholder="0"
            min="0"
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    actor,
                    currentTarget.name,
                    Number(currentTarget.value),
                )}
        />

        /

        <input
            class="a5e-input a5e-input--actor-footer"
            type="number"
            name="system.attributes.exertion.max"
            value={exertion.max}
            disabled={actor.automationAvailable}
            placeholder="0"
            min="0"
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    actor,
                    currentTarget.name,
                    Number(currentTarget.value),
                )}
        />

        {#if exertion.current < exertion.max && exertion.max}
            <button
                class="a5e-button a5e-button--transparent"
                data-tooltip="A5E.exertion.rechargeFromHitDice"
                data-tooltip-direction="UP"
                aria-label="A5E.exertion.rechargeFromHitDice"
                onclick={() => actor.recoverExertionUsingHitDice()}
            >
                <i class="fa-solid fa-bolt"></i>
            </button>
        {/if}
    </FieldWrapper>
{/if}

<!-- NPC Caster Level Configuration -->
{#if actor.type === "npc"}
    <FieldWrapper
        heading="A5E.spells.spellcasting.casterLevel"
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
        --a5e-field-wrapper-gap="0.5rem"
    >
        <input
            class="a5e-input a5e-input--actor-footer"
            class:disable-pointer-events={!actor.isOwner || sheetIsLocked()}
            type="number"
            name="system.attributes.casterLevel"
            value={actor.system.attributes.casterLevel}
            placeholder="0"
            min="0"
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    actor,
                    currentTarget.name,
                    Number(currentTarget.value),
                )}
        />
    </FieldWrapper>
{/if}
