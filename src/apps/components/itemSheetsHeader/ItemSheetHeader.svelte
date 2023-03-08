<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import editDocumentImage from "../../handlers/editDocumentImage";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const prerequisiteTypes = ["maneuver", "feature"];
    const appId = getContext("appId");
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

    <div>
        <input
            type="text"
            name="name"
            value={$item.name}
            class="item-name"
            placeholder={localize("A5E.Name")}
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
    <button
        class="broken-item-icon fa-solid fa-question"
        data-tooltip={$item.system.broken
            ? "A5E.ButtonToolTipFixBroken"
            : "A5E.ButtonToolTipBroken"}
        data-tooltip-direction="UP"
        on:click|stopPropagation={() => $item.toggleUnidentified()}
    />

    {#if $item.system.broken}
        <i
            class="broken-item-icon fa-solid fa-heart-crack"
            data-tooltip="A5E.BrokenItem"
            data-tooltip-direction="DOWN"
        />
    {/if}
</header>

<style lang="scss">
    .broken-item-icon {
        font-size: 2.25rem;
        color: #8b2525;
        padding-right: 1rem;
        margin-left: auto;
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
</style>
