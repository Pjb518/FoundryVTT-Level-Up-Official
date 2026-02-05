<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
    import evaluateMathExpression from "#utils/evaluateMathExpression.ts";

    import ActorItemWeightTrack from "./ActorItemWeightTrack.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    function getBulkyTooltip() {
        let bulkyLimit: number;

        const supply = actorStore.supply;

        if (supply) bulkyLimit = Math.max(1 + actorStore.abilities.str.mod, 1);
        else bulkyLimit = Math.max(2 + actorStore.abilities.str.mod, 2);

        return `Bulky Limit: ${bulkyLimit}`;
    }

    function getCurrency() {
        let allCurrency: Record<string, number> = actorStore.currency;
        if (useCredits) {
            return { cr: allCurrency.cr ?? 0 };
        }

        return Object.entries(allCurrency ?? {}).reduce(
            (acc: Record<string, number>, [key, value]) => {
                if (key !== "cr") {
                    acc[key] = value ?? 0;
                }
                return acc;
            },
            {},
        );
    }

    function getSupplyTooltip() {
        const { supply } = actorStore;
        const freeSupplyLimit = actorStore.abilities.str.value ?? 0;

        const excessSupply = Math.abs(Math.min(freeSupplyLimit - supply, 0));

        if (excessSupply) {
            return `Free Supply: ${freeSupplyLimit} &nbsp;&nbsp;|&nbsp;&nbsp; Additional Supply: ${excessSupply}`;
        }

        return `Free Supply: ${supply} &nbsp;&nbsp;|&nbsp;&nbsp; Additional Supply: 0`;
    }

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");
    let actorStore = $derived(actor.reactive.system);
    let flags = $derived(actor.flags?.a5e ?? {});

    const showVRCImplants =
        (game.settings.get("a5e", "showVRCImplants") as boolean) ?? false;

    const useCredits = (game.settings.get("a5e", "useCredits") as boolean) ?? false;

    let bulkyItems = $derived(
        actor.reactive.items.reduce((bulkyCount: number, item: Item) => {
            if (item.system.bulky && item.system.equippedState) {
                if (
                    item.system.objectType === "armor" &&
                    item.system.equippedState === 2
                ) {
                } else bulkyCount += 1;
            }
            return bulkyCount;
        }, 0),
    );

    let implantItems = $derived(
        actor.reactive.items.reduce((implantCount: number, item: Item) => {
            if (item.system.implant && item.system.equippedState) {
                implantCount += 1;
            }

            return implantCount;
        }, 0),
    );

    let supplyItems = $derived(
        actor.reactive.items.reduce((supplyCount: number, item: Item) => {
            if (item.system.supply && item.system.equippedState) supplyCount += 1;

            return supplyCount;
        }, 0),
    );

    let attunement = $derived(actorStore.attributes.attunement);
    let bulkyTooltip = $derived(getBulkyTooltip());
    let supply = $derived(actorStore.supply);
    let supplyTooltip = $derived(getSupplyTooltip());
    let totalSupply = $derived(actorStore.supply + supplyItems);
    let implantMax = $derived(actorStore.attributes.prof);
    let currency: Record<string, number> = $derived(getCurrency());
</script>

{#if flags?.trackInventoryWeight ?? true}
    <ActorItemWeightTrack />
{/if}

<section class="a5e-footer-group--inventory">
    {#if actor.type === "character"}
        <!-- Attunement -->
        <FieldWrapper
            heading="A5E.attunement.headings.attunement"
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-item-alignment="center"
            --a5e-field-wrapper-gap="0.5rem"
            --a5e-field-wrapper-header-width="100%"
        >
            <span class="a5e-footer-group__value a5e-footer-group__value--attunement">
                {attunement.current}
            </span>

            /

            <input
                class="a5e-footer-group__input"
                class:disable-pointer-events={!actor.isOwner}
                type="number"
                name="system.attributes.attunement.max"
                value={attunement.max}
                placeholder="0"
                min="0"
                max="9"
                disabled={sheetIsLocked()}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        actor,
                        currentTarget.name,
                        Number(currentTarget.value),
                    )}
            />
        </FieldWrapper>

        <!-- Supply -->
        <FieldWrapper
            heading="A5E.supply.title"
            headingTooltip={supplyTooltip}
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-item-alignment="center"
            --a5e-field-wrapper-gap="0.5rem"
            --a5e-field-wrapper-header-width="100%"
        >
            {#if !sheetIsLocked()}
                <input
                    class="a5e-footer-group__input"
                    class:disable-pointer-events={!actor.isOwner}
                    type="number"
                    name="system.supply"
                    value={supply}
                    placeholder="0"
                    min="0"
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            actor,
                            currentTarget.name,
                            Number(currentTarget.value),
                        )}
                />
            {:else}
                <input
                    class="a5e-footer-group__input"
                    class:disable-pointer-events={!actor.isOwner}
                    type="number"
                    name="system.supply"
                    value={totalSupply}
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
            {/if}
        </FieldWrapper>
    {/if}

    <!-- Bulky Items -->
    <FieldWrapper
        heading="Bulky Items"
        headingTooltip={bulkyTooltip}
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
        --a5e-field-wrapper-gap="0.5rem"
        --a5e-field-wrapper-header-width="100%"
    >
        <span class="a5e-footer-group__value">
            {bulkyItems}
        </span>
    </FieldWrapper>

    <!-- Implants -->
    {#if showVRCImplants}
        <FieldWrapper
            heading={localize("A5E.objects.implant")}
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-item-alignment="center"
            --a5e-field-wrapper-gap="0.5rem"
            --a5e-field-wrapper-header-width="100%"
        >
            <span class="a5e-footer-group__value a5e-footer-group__value--attunement">
                {implantItems}
            </span>

            /

            <input
                class="a5e-footer-group__input"
                class:disable-pointer-events={!actor.isOwner}
                type="number"
                name="system.attributes.prof"
                value={implantMax}
                placeholder="0"
                min="0"
                max="9"
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

    <!-- Currencies -->
    <FieldWrapper
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
        --a5e-field-wrapper-gap="0.5rem"
        --a5e-field-wrapper-wrap="nowrap"
    >
        {#each Object.entries(currency) as [label, value]}
            <div class="a5e-actor-sheet-footer__flex-container">
                <label
                    class="a5e-actor-sheet-footer__flex-container__label"
                    for="{actor.id}-currency-{label}"
                >
                    {localize(label)}
                </label>

                <input
                    class="a5e-input a5e-input--actor-footer"
                    class:disable-pointer-events={!actor.isOwner}
                    id="{actor.id}-currency-{label}"
                    name="system.currency.{label}"
                    type="text"
                    {value}
                    min="0"
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            actor,
                            currentTarget.name,
                            Number(
                                evaluateMathExpression({
                                    expression: currentTarget.value,
                                    previousValue: value,
                                }),
                            ),
                        )}
                />
            </div>
        {/each}
    </FieldWrapper>
</section>

<style lang="scss">
    .a5e-actor-sheet-footer__flex-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;

        &__label {
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 0.125rem;
        }
    }
</style>
