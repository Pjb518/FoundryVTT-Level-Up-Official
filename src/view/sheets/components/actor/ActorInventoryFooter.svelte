<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
    import evaluateMathExpression from "#utils/evaluateMathExpression.ts";

    function getBulkyTooltip() {
        let bulkyLimit: number;

        const supply = actorStore.supply;

        if (supply) bulkyLimit = Math.max(1 + actorStore.abilities.str.mod, 1);
        else bulkyLimit = Math.max(2 + actorStore.abilities.str.mod, 2);

        return `Bulky Limit: ${bulkyLimit}`;
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

    const useCredits =
        (game.settings.get("a5e", "useCredits") as boolean) ?? false;

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
            if (item.system.supply && item.system.equippedState)
                supplyCount += 1;

            return supplyCount;
        }, 0),
    );

    let attunement = $derived(actorStore.attributes.attunement);
    let bulkyTooltip = $derived(getBulkyTooltip());
    let currency = $derived(actorStore.currency);
    let supply = $derived(actorStore.supply);
    let supplyTooltip = $derived(getSupplyTooltip());
    let totalSupply = $derived(actorStore.supply + supplyItems);
    let implantMax = $derived(actorStore.system.attributes.prof);
</script>

{#if flags?.trackInventoryWeight}
    <!--  -->
{/if}

<section class="a5e-shield__container">
    {#if actor.type === "character"}
        <!-- Attunement -->
        <div class="a5e-shield a5e-shield--attunement">
            <h3 class="a5e-shield__header">
                {localize("A5E.attunement.headings.attunement")}
            </h3>

            <span
                class="a5e-footer-group__value a5e-footer-group__value--attunement"
            >
                {attunement.current}
            </span>
            /
            <input
                class="a5e-input a5e-input--slim a5e-shield__input"
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
        </div>

        <!-- Supply -->
        <div class="a5e-shield">
            <h3
                class="a5e-shield__header"
                data-tooltip={supplyTooltip}
                data-tooltip-direction="UP"
            >
                {localize("A5E.supply.title")}
            </h3>

            {#if !sheetIsLocked()}
                <input
                    class="a5e-input a5e-input--slim a5e-shield-input a5e-footer-group__input"
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
                    class="a5e-input a5e-input--slim shield-input a5e-footer-group__input"
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
        </div>
    {/if}

    <!-- Bulky Items -->
    <div class="shield">
        <h3
            class="footer-shield-header"
            data-tooltip={bulkyTooltip}
            data-tooltip-direction="UP"
        >
            {localize("Bulky Items")}
        </h3>

        <span class="a5e-footer-group__value">
            {bulkyItems}
        </span>
    </div>

    <!-- Implants -->
    {#if showVRCImplants}
        <div class="shield shield--implants">
            <h3 class="footer-shield-header">
                {localize("A5E.objects.implant")}
            </h3>

            <span
                class="a5e-footer-group__value a5e-footer-group__value--implants"
            >
                {implantItems}
            </span>
            /
            <input
                class="shield-input a5e-footer-group__input"
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
        </div>
    {/if}

    <!-- Currencies -->
    <div
        class="
		u-flex u-gap-sm u-text-sm
		shield
		shield--currency
	"
        class:u-ml-auto={actor.type === "npc"}
        class:u-mr-auto={actor.type === "npc"}
    >
        <ol class="currency__list">
            {#each Object.entries(currency) as [label, value]}
                {#if useCredits && label == "cr"}
                    <li class="currency__item" data-type={label}>
                        <label
                            class="currency__label"
                            class:disable-pointer-events={!actor.isOwner}
                            for="currency-{label}"
                        >
                            {localize(label)}
                        </label>

                        <input
                            class="a5e-footer-group__input a5e-footer-group__input--currency shield-input"
                            class:disable-pointer-events={!actor.isOwner}
                            id="currency-{label}"
                            type="text"
                            name="system.currency.{label}"
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
                    </li>
                {:else if !useCredits && label != "cr"}
                    <li class="currency__item" data-type={label}>
                        <label
                            class="currency__label"
                            class:disable-pointer-events={!actor.isOwner}
                            for="currency-{label}"
                        >
                            {localize(label)}
                        </label>

                        <input
                            class="a5e-footer-group__input a5e-footer-group__input--currency shield-input"
                            class:disable-pointer-events={!actor.isOwner}
                            id="currency-{label}"
                            type="text"
                            name="system.currency.{label}"
                            {value}
                            min="0"
                            onchange={({ currentTarget }) =>
                                updateDocumentDataFromField(
                                    actor,
                                    currentTarget.name,
                                    Number(
                                        evaluateMathExpression({
                                            expression: currentTarget.value,
                                            min: 0,
                                            previousValue: value,
                                        }),
                                    ),
                                )}
                        />
                    </li>
                {/if}
            {/each}
        </ol>
    </div>
</section>

<style lang="scss">
</style>
