<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import editDocumentImage from "../../handlers/editDocumentImage";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    // function getPublisherTooltip(item) {
    //     const publisher = item.system.source?.publisher;
    //     const productName = item.system.source?.name;
    //     const publisherName = CONFIG.A5E.publishers[publisher]?.name;

    //     if (!publisher || !productName || !publisherName) return null;

    //     if (productName) {
    //         return `${publisherName} - ${productName}`;
    //     }

    //     return `${publisherName}`;
    // }

    async function fulfilDestiny() {
        const fulfillmentFeature = await fromUuid(
            $item.system.fulfillmentFeature,
        );
        if (!fulfillmentFeature || !$item.actor) return;
        if ($item.actor.getFlag("a5e", "destinyFulfilled") ?? false) return;

        await $item.actor.createEmbeddedDocuments("Item", [fulfillmentFeature]);
        await $item.actor.setFlag("a5e", "destinyFulfilled", true);
        disableFulfil = true;
    }

    // TODO: Re-add this in 0.9.1 or later, as there is more work required to make
    // this useful.
    //
    // function getItemName(item) {
    //     if (game.user.isGM) return item.name;
    //     if (!item.system.unidentified) return item.name;

    //     return unidentifiedName ?? localize("A5E.ItemUnidentifiedName");
    // }

    // $: name = getItemName($item);

    const item = getContext("item");
    const { A5E } = CONFIG;
    const { DAMAGED_STATES } = A5E;
    const prerequisiteTypes = ["maneuver", "feature", "spell"];
    const headerButtonTypes = ["object"];
    const appId = getContext("appId");
    // const publisher = $item.system.source?.publisher;
    // const publisherLogo = CONFIG.A5E.publishers[publisher]?.logo;
    // const publisherTooltip = getPublisherTooltip($item);
    // const productLink = $item.system.source?.link ?? null;

    let disableFulfil = $item.actor?.getFlag("a5e", "destinyFulfilled") ?? true;
</script>

<header class="sheet-header">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <img
        class="item-image"
        src={$item.img}
        alt={$item.name}
        title={$item.name}
        on:click={() => editDocumentImage($item)}
    />

    <div class="name-wrapper">
        <input
            type="text"
            name="name"
            value={$item.name}
            class="item-name"
            placeholder={"A5E.Name"}
            on:change={({ target }) =>
                updateDocumentDataFromField($item, target.name, target.value)}
        />

        {#if prerequisiteTypes.includes($item.type)}
            <div class="prerequisites">
                <label class="prerequisite-label" for="{appId}-prerequisites">
                    {localize("A5E.Prerequisite")}:
                </label>

                <input
                    id="{appId}-prerequisites"
                    type="text"
                    name="system.prerequisite"
                    value={$item.system.prerequisite}
                    class="prerequisite-input"
                    placeholder={localize("A5E.None")}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            target.name,
                            target.value,
                        )}
                />
            </div>
        {/if}
    </div>

    {#if headerButtonTypes.includes($item.type)}
        <div class="button-container">
            <!-- svelte-ignore missing-declaration -->
            <button
                class="header-button fa-solid fa-circle-question"
                class:active={$item.system.unidentified}
                class:locked={!game.user.isGM}
                disabled={!game.user.isGM}
                data-tooltip={$item.system.unidentified
                    ? "A5E.ButtonToolTipUnidentified"
                    : "A5E.ButtonToolTipIdentified"}
                data-tooltip-direction="UP"
                on:click|stopPropagation={() => $item.toggleUnidentified()}
            />

            {#if $item.actor && $item.system.requiresAttunement}
                <button
                    class="header-button fa-solid fa-link"
                    class:active={$item.system.attuned}
                    data-tooltip={$item.system.attuned
                        ? localize("A5E.ButtonToolTipBreakAttunement", {
                              item: $item.name,
                          })
                        : localize("A5E.ButtonToolTipAttune", {
                              item: $item.name,
                          })}
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => $item.toggleAttunement()}
                />
            {/if}

            <button
                class="header-button fas"
                class:fa-heart={$item.system.damagedState ===
                    DAMAGED_STATES.INTACT}
                class:fa-heart-crack={$item.system.damagedState ===
                    DAMAGED_STATES.DAMAGED}
                class:fa-heart-pulse={$item.system.damagedState ===
                    DAMAGED_STATES.BROKEN}
                class:active={[
                    DAMAGED_STATES.DAMAGED,
                    DAMAGED_STATES.BROKEN,
                ].includes($item.system.damagedState)}
                data-tooltip={A5E.damagedStates[$item.system.damagedState ?? 0]}
                data-tooltip-direction="UP"
                on:click|stopPropagation={() => $item.toggleDamagedState()}
            />
        </div>
    {/if}

    <div class="u-flex u-flex-shrink-0 u-align-center u-gap-xl">
        {#if $item.type === "destiny"}
            <button
                class="fulfil-button"
                disabled={disableFulfil}
                on:click={() => fulfilDestiny()}
            >
                {localize("A5E.FulfilDestiny")}
            </button>
        {/if}
    </div>
</header>

<style lang="scss">
    .button-container {
        display: flex;
        margin-left: auto;
        padding-right: 1rem;
        gap: 0.75rem;
    }

    .header-button {
        display: flex;
        font-size: 2.25rem;
        transition: $standard-transition;
        padding: 0;
        background: none;
        color: #999;
        cursor: pointer;

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }

    .active {
        color: $color-primary;

        &:hover {
            color: $color-primary;
            box-shadow: none;
        }
    }

    .locked {
        cursor: default;
        &:hover {
            transform: none;
            color: #999;

            &.active {
                transform: none;
                color: $color-primary;
            }
        }
    }

    .sheet-header {
        display: flex;
        align-items: center;
    }

    .item-image {
        width: 3rem;
        height: 3rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .item-name,
    .item-name[type="text"] {
        font-family: $font-primary;
        font-size: $font-size-xxl;
        border: 0;
        background: transparent;
        text-overflow: ellipsis;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .prerequisite-input,
    .prerequisite-input[type="text"] {
        border: 0;
        background: transparent;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .prerequisite-label {
        padding-inline: 0.5rem 0rem;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .prerequisites {
        display: flex;
        align-items: center;
        font-family: $font-primary;
        font-size: $font-size-md;
        align-items: center;
    }

    .name-wrapper {
        width: 100%;
    }

    .fulfil-button {
        background: #82817d;
        color: white;
        width: max-content;
        font-size: $font-size-xs;
        padding-inline: 0.75rem;
        white-space: nowrap;
        transition: $standard-transition;

        &:disabled {
            cursor: auto;
        }

        &:hover:not(:disabled),
        &:focus:not(:disabled) {
            box-shadow: none;
            background-color: $color-primary;
        }
    }
</style>
