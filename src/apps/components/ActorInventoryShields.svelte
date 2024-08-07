<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    function getBulkyTooltip(actor) {
        let bulkyLimit;
        const { supply } = actor.system;

        if (supply) {
            bulkyLimit = Math.max(1 + actor.system.abilities.str.mod, 1);
        } else {
            bulkyLimit = Math.max(2 + actor.system.abilities.str.mod, 2);
        }

        return `Bulky Limit: ${bulkyLimit}`;
    }

    function getSupplyTooltip(actor) {
        const { supply } = actor.system;
        const freeSupplyLimit = actor.system.abilities.str.value;

        const excessSupply = Math.abs(Math.min(freeSupplyLimit - supply, 0));

        if (excessSupply) {
            return `Free Supply: ${freeSupplyLimit} &nbsp;&nbsp;|&nbsp;&nbsp; Additional Supply: ${excessSupply}`;
        } else {
            return `Free Supply: ${supply} &nbsp;&nbsp;|&nbsp;&nbsp; Additional Supply: 0`;
        }
    }

    $: bulkyItems = $actor.items.reduce((bulkyCount, item) => {
        if (item.system.bulky) bulkyCount += 1;
        return bulkyCount;
    }, 0);

    $: sheetIsLocked = !$actor.isOwner ? true : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: attunement = $actor.system.attributes.attunement;
    $: bulkyTooltip = getBulkyTooltip($actor);
    $: currency = $actor.system.currency;
    $: supply = $actor.system.supply;
    $: supplyTooltip = getSupplyTooltip($actor);
</script>

<section class="shield-container">
    {#if $actor.type === "character"}
        <!-- Attunement -->
        <div class="shield shield--attunement">
            <h3 class="footer-shield-header">
                {localize("A5E.Attunement")}
            </h3>

            <span class="a5e-footer-group__value a5e-footer-group__value--attunement">
                {attunement.current}
            </span>
            /
            <input
                class="shield-input a5e-footer-group__input"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.attributes.attunement.max"
                value={attunement.max}
                placeholder="0"
                min="0"
                max="9"
                disabled={sheetIsLocked}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value),
                    )}
            />
        </div>

        <!-- Supply -->
        <div class="shield">
            <h3
                class="footer-shield-header"
                data-tooltip={supplyTooltip}
                data-tooltip-direction="UP"
            >
                {localize("A5E.Supply")}
            </h3>

            <input
                class="shield-input a5e-footer-group__input"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.supply"
                value={supply}
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

    <!-- Currencies -->
    <div
        class="
		u-flex u-gap-sm u-text-sm
		shield
		shield--currency
	"
        class:u-ml-auto={$actor.type === "npc"}
        class:u-mr-auto={$actor.type === "npc"}
    >
        <ol class="currency__list">
            {#each Object.entries(currency) as [label, value]}
                <li class="currency__item" data-type={label}>
                    <label
                        class="currency__label"
                        class:disable-pointer-events={!$actor.isOwner}
                        for="currency-{label}"
                    >
                        {localize(label)}
                    </label>

                    <input
                        class="a5e-footer-group__input a5e-footer-group__input--currency shield-input"
                        class:disable-pointer-events={!$actor.isOwner}
                        id="currency-{label}"
                        type="number"
                        name="system.currency.{label}"
                        {value}
                        min="0"
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                Number(target.value),
                            )}
                    />
                </li>
            {/each}
        </ol>
    </div>
</section>

<style lang="scss">
    .currency {
        &__item {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
        }

        &__label {
            margin-bottom: 0;
            font-weight: bold;
            text-transform: uppercase;
            text-align: center;
        }

        &__list {
            display: flex;
            gap: 0.25rem;
            margin: 0;
            padding: 0;
            list-style: none;
        }
    }

    .disable-pointer-events {
        pointer-events: none;
    }

    .footer-shield-header {
        flex: 0 0 100%;
        text-align: center;
        font-size: var(--a5e-text-size-sm);
        font-weight: bold;
    }

    .shield {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;

        &--attunement {
            width: 5rem;
        }
    }

    .shield-container {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-around;
        gap: 0.5rem;
    }
</style>
