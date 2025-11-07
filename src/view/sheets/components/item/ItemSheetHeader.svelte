<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { editDocumentImage } from "#utils/view/editDocumentImage.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);

    const isGM = game.user?.isGM;
    const prerequisiteTypes = ["maneuver", "feature", "spell"];
    const { DAMAGED_STATES, damagedStates } = CONFIG.A5E;
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
                    {localize("A5E.items.headings.prerequisite")}:
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

    {#if item.type === "object"}
        <div class="a5e-item-sheet-header__button-container">
            <button
                class="a5e-button a5e-item-sheet-header__button"
                class:a5e-item-sheet-header__button-active={itemStore.unidentified}
                class:a5e-item-sheet-header__button-locked={!isGM}
                disabled={!isGM}
                data-tooltip={itemStore.unidentified
                    ? "A5E.ButtonToolTipUnidentified"
                    : "A5E.ButtonToolTipIdentified"}
                data-tooltip-direction="UP"
                aria-label="Toggle Mystification"
                onclick={(e) => {
                    e.stopPropagation();
                    item.toggleUnidentified();
                }}
            >
                <i class="fa-solid fa-circle-question"></i>
            </button>

            {#if item.actor && itemStore.requiresAttunement}
                <button
                    class="a5e-button a5e-item-sheet-header__button"
                    class:a5e-item-sheet-header__button-active={itemStore.attuned}
                    data-tooltip={itemStore.attuned
                        ? localize("A5E.ButtonToolTipBreakAttunement", {
                              item: item.name,
                          })
                        : localize("A5E.ButtonToolTipAttune")}
                    data-tooltip-direction="UP"
                    aria-label="Toggle Attunement"
                    onclick={(e) => {
                        e.stopPropagation();
                        item.toggleAttunement();
                    }}
                >
                    <i class="fa-solid fa-link"></i>
                </button>
            {/if}

            <button
                class="a5e-button a5e-item-sheet-header__button"
                data-tooltip={damagedStates[itemStore.damagedState ?? 0]}
                data-tooltip-direction="UP"
                aria-label="Toggle Damaged State"
                onclick={(e) => {
                    e.stopPropagation();
                    item.toggleDamagedState();
                }}
            >
                <i
                    class="fa-solid"
                    class:fa-heart={itemStore.damagedState === DAMAGED_STATES.INTACT}
                    class:fa-heart-crack={itemStore.damagedState ===
                        DAMAGED_STATES.DAMAGED}
                    class:fa-heart-pulse={itemStore.damagedState ===
                        DAMAGED_STATES.BROKEN}
                    class:a5e-item-sheet-header__button-active={[
                        DAMAGED_STATES.DAMAGED,
                        DAMAGED_STATES.BROKEN,
                    ].includes(itemStore.damagedState)}
                ></i>
            </button>
        </div>
    {/if}
</header>

<style lang="scss">
    .a5e-item-sheet-header {
        display: flex;
        gap: 0.5rem;
        grid-area: header;
        align-items: center;

        &__button-container {
            display: flex;
            margin-left: auto;
            gap: 0.75rem;
        }

        &__button {
            display: flex;
            font-size: 2.25rem;
            padding: 0;
            margin: 0;
            background: none;
            border: 0;
            width: min-content;
            color: var(--a5e-button-gray);

            &:hover,
            &:focus {
                color: var(--a5e-button-gray-hover);
                transform: scale(1.2);
            }

            &-active {
                color: var(--a5e-color-primary);

                &:hover,
                &:focus {
                    color: var(--a5e-color-primary);
                }
            }

            &-locked {
                cursor: default;

                &:hover {
                    transform: none;
                    color: var(--a5e-button-gray);
                }
            }
        }
    }

    .a5e-item-sheet {
        &__name-wrapper {
            display: flex;
            flex-direction: column;
            padding: 0;
            margin: 0;
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
                height: var(--a5e-sm-text);
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
