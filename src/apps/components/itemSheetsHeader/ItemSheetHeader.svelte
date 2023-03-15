<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import editDocumentImage from "../../handlers/editDocumentImage";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const prerequisiteTypes = ["maneuver", "feature"];
    const headerButtonTypes = ["object"];
    const appId = getContext("appId");

    // TODO: Re-add this in 0.9.1 or later, as there is more work required to make
    // this useful.
    //
    // function getItemName(item) {
    //     if (game.user.isGM) return item.name;
    //     if (!item.system.unidentified) return item.name;

    //     return unidentifiedName ?? localize("A5E.ItemUnidentifiedName");
    // }

    // $: name = getItemName($item);
</script>

<header class="sheet-header">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
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
                            target.value
                        )}
                />
            </div>
        {/if}
    </div>

    {#if headerButtonTypes.includes($item.type)}
        <div class="button-container">
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
            <button
                class="header-button fa-solid fa-heart-crack"
                class:active={$item.system.broken}
                data-tooltip={$item.system.broken
                    ? "A5E.ButtonToolTipFixBroken"
                    : "A5E.ButtonToolTipBroken"}
                data-tooltip-direction="UP"
                on:click|stopPropagation={() => $item.toggleBroken()}
            />
        </div>
    {/if}
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
        transition: all 0.15s ease-in-out;
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
        color: #425f65;

        &:hover {
            color: #425f65;
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
                color: #425f65;
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
        font-family: "Modesto Condensed", serif;
        font-size: 1.728rem;
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
        font-family: "Modesto Condensed", serif;
        font-size: 1rem;
        align-items: center;
    }

    .name-wrapper {
        width: 100%;
    }
</style>
