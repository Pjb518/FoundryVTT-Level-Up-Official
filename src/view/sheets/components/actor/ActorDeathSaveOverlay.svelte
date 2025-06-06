<script lang="ts">
    import { getContext } from "svelte";

    import { pressedKeys } from "#stores/pressedKeysStore.svelte.ts";

    import { getKeyPressAsOptions } from "#utils/view/getKeyPressAsOptions.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: Actor = getContext("actor");

    let isBlind = game.settings.get("a5e", "blindDeathSaves");
    let death = $derived(actor.reactive.system.attributes.death);
</script>

<div class="a5e-actor-death-saves">
    <button
        class="a5e-actor-death-saves__button"
        aria-label="Increase Death Success"
        onclick={() =>
            updateDocumentDataFromField(
                actor,
                "system.attributes.death.success",
                death.success + 1,
            )}
    >
        <i class="fa-solid fa-check"></i>
    </button>

    {#if !isBlind}
        <input
            class="a5e-input a5e-input--slim a5e-actor-death-saves__input"
            type="number"
            name="system.attributes.death.success"
            placeholder="?"
            min="0"
            data-tooltip="A5E.deathSavingThrow.success"
            data-tooltip-direction="UP"
            value={death.success}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    actor,
                    currentTarget.name,
                    Number(currentTarget.value),
                )}
        />
    {/if}

    <div
        class="a5e-actor-death-saves__icon u-align-center u-flex u-flex-col u-pos-relative"
    >
        <button
            class="a5e-actor-death-saves__button"
            data-tooltip="A5E.deathSavingThrow.roll"
            data-tooltip-direction="UP"
            aria-label="Roll Death Saving Throw"
            onclick={actor.rollDeathSavingThrow(
                getKeyPressAsOptions(pressedKeys),
            )}
        >
            <i class="fas fa-skull a5e-js-roll-death-saving-throw"></i>
        </button>
    </div>

    {#if !isBlind}
        <input
            class="a5e-input a5e-input--slim a5e-actor-death-saves__input"
            type="number"
            name="system.attributes.death.failure"
            data-dtype="Number"
            placeholder="0"
            min="0"
            data-tooltip="A5E.deathSavingThrow.failure"
            data-tooltip-direction="UP"
            value={isBlind ? "?" : death.failure}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    actor,
                    currentTarget.name,
                    Number(currentTarget.value),
                )}
        />
    {/if}

    <button
        class="a5e-actor-death-saves__button"
        aria-label="Increase Death Failures"
        onclick={() =>
            updateDocumentDataFromField(
                actor,
                "system.attributes.death.failure",
                death.failure + 1,
            )}
    >
        <i class="icon fas fa-times"> </i>
    </button>
</div>

<style lang="scss">
    .a5e-actor-death-saves {
        display: flex;
        align-items: center;
        gap: 0.25rem;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 5;
        min-width: 85%;

        border-radius: 5px;
        padding: 0.5rem;

        background: rgba(139, 37, 37, 0.85);
        color: rgba(255 255 255 / 0.75);

        &__icon {
            cursor: pointer;
            font-size: var(--a5e-text-size-lg);
            transition: var(--a5e-transition-standard);

            &:hover {
                color: #fff;
            }
        }

        &__button {
            padding: 0;
            margin: 0;
            background: transparent;
            color: inherit;

            &:hover,
            &:focus {
                box-shadow: none;
            }
        }

        &__input[type="number"] {
            border: 0;
            background: transparent;
            color: inherit;
            font-size: var(--a5e-text-size-md);
            text-align: center;
            padding: 0;

            &:active,
            &:focus {
                box-shadow: none;
            }
        }
    }
</style>
