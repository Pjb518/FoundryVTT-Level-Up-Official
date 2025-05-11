<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { editDocumentImage } from "#utils/view/editDocumentImage.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);

    const isGM = game.user?.isGM;
    const prerequisiteTypes = ["maneuver", "feature", "spell"];
</script>

<header class="a5e-item-sheet-header">
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <img
        class="a5e-item-image"
        src={item.reactive.img}
        alt={item.reactive.name}
        onclick={() => editDocumentImage(item)}
    />

    <div class="a5e-item-sheet__name-wrapper">
        <input
            class="a5e-item-sheet__item-name"
            type="text"
            value={item.reactive.name}
            placeholder={localize("A5E.Name")}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(item, "name", currentTarget.value)}
        />

        {#if prerequisiteTypes.includes(item.type)}
            <div class="a5e-item-sheet__prerequisites">
                <label
                    class="a5e-item-sheet__prerequisites-label"
                    for="{item.uuid}-prerequisites"
                >
                    {localize("A5E.Prerequisite")}:
                </label>

                <input
                    id="{item.uuid}-prerequisites"
                    class="a5e-input a5e-input--slim a5e-item-sheet__prerequisites-input"
                    type="text"
                    name="system.prerequisite"
                    value={itemStore.prerequisite}
                    placeholder={localize("A5E.None")}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            currentTarget.name,
                            currentTarget.value,
                        )}
                />
            </div>
        {/if}
    </div>
</header>

<style lang="scss">
    .a5e-item-sheet-header {
        display: flex;
        gap: 0.5rem;
        /* margin-block: 0.5rem;
        margin-inline: 0.25rem; */
        grid-area: header;

        align-items: center;
    }

    .a5e-item-sheet {
        &__name-wrapper {
            display: flex;
            flex-direction: column;
            padding: 0;
            margin: 0;
            gap: 0.5rem;
            width: 100%;
        }

        &__item-name {
            font-family: var(--a5e-secondary-font);
            font-size: var(--a5e-xl-text);
            color: var(--a5e-text-color-dark);
            border: 0;
            background: transparent;
            text-overflow: ellipsis;
            padding: 0;
            margin: 0;
        }

        &__prerequisites {
            display: flex;
            align-items: center;

            &-label {
                padding-inline: 0.5rem 0rem;
                font-family: var(--a5e-secondary-font);
                font-size: var(--a5e-sm-text);
            }

            &-input {
                border: 0;
                background: transparent;
                font-family: var(--a5e-secondary-font);
                font-size: var(--a5e-sm-text);
                color: var(--a5e-text-color-dark);
            }
        }
    }

    .a5e-item-image {
        width: 4rem;
        aspect-ratio: 1;
        border-radius: var(--a5e-border-radius-standard);
        cursor: pointer;
    }
</style>
