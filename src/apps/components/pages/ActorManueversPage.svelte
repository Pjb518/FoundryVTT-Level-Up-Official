<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    import usesRequired from "../../../utils/usesRequired";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import ShowDescription from "../actorUtilityBar/ShowDescription.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import TabFooter from "../TabFooter.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    const actor = getContext("actor");
    const { maneuvers } = actor;

    const subTypes = CONFIG.A5E.maneuverDegrees;
    const reducerType = "maneuvers";

    $: exertion = $actor.system.attributes.exertion;
    $: menuList = Object.entries(subTypes);
    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    let showDescription = false;
</script>

<div class="maneuvers-page">
    {#if $actor.isOwner}
        <UtilityBar>
            <Search {reducerType} />
            <ShowDescription
                on:updateSelection={() => (showDescription = !showDescription)}
            />
            <Sort {reducerType} />
            <Filter {reducerType} />
            <CreateMenu {reducerType} {menuList} />
        </UtilityBar>
    {/if}

    <section class="maneuvers-main-container">
        {#each Object.entries($maneuvers._degrees) as [label, items]}
            {#if items.length}
                <ItemCategory
                    {label}
                    {items}
                    {showDescription}
                    type="maneuverDegrees"
                    usesRequired={usesRequired(maneuvers)}
                />
            {/if}
        {/each}
    </section>

    <TabFooter>
        {#if $actor.type === "character"}
            <div class="u-flex u-align-center u-gap-md">
                <h3 class="u-mb-0 u-text-sm u-text-bold">
                    {localize("A5E.ExertionPool")}
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
                            Number(target.value)
                        )}
                />
                /
                <input
                    class="a5e-footer-group__input"
                    type="number"
                    name="system.attributes.exertion.max"
                    value={exertion.max}
                    placeholder="0"
                    min="0"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value)
                        )}
                />

                {#if exertion.current < exertion.max && exertion.max}
                    <button
                        class="recharge-button"
                        data-tooltip="A5E.ExertionRechargeFromHitDice"
                        data-tooltip-direction="UP"
                        on:click={() => $actor.recoverExertionUsingHitDice()}
                    >
                        <i class="fa-solid fa-bolt" />
                    </button>
                {/if}
            </div>
        {/if}

        {#if !sheetIsLocked}
            <div class="u-flex u-align-center u-gap-md u-mr-lg u-ml-auto">
                <h3 class="u-mb-0 u-text-sm u-text-bold">
                    {localize("A5E.ConfigureManeuvers")}
                </h3>

                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <i
                    class="fas fa-gear a5e-config-button"
                    on:click={() => $actor.configureManeuvers()}
                />
            </div>
        {/if}
    </TabFooter>
</div>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .maneuvers-page {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
        overflow: hidden;
    }
    .maneuvers-main-container {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 0.75rem;
        overflow-y: auto;
        overflow-x: hidden;
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

        transition: $standard-transition;

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
