<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: attunement = $actor.system.attributes.attunement;
    $: currency = $actor.system.currency;
    $: supply = $actor.system.supply;
</script>

<section class="shield-container">
    {#if $actor.type === "character"}
        <!-- Attunement -->
        <div class="shield shield--attunement">
            <h3 class="footer-shield-header">
                {localize("A5E.Attunement")}
            </h3>
            <span
                class="a5e-footer-group__value a5e-footer-group__value--attunement"
            >
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
                        Number(target.value)
                    )}
            />
        </div>

        <!-- Supply -->
        <div class="shield shield--supply">
            <h3 class="footer-shield-header">
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
                        Number(target.value)
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
                                Number(target.value)
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
        font-size: 0.833rem;
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
