<script>
    import { getContext } from "svelte";

    import pressedKeysStore from "../../../stores/pressedKeysStore";

    import getKeyPressAsOptions from "../../handlers/getKeyPressAsOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: death = $actor.system.attributes.death;
</script>

<div class="death-saves">
    <button
        class="death-saves__button"
        on:click={() =>
            updateDocumentDataFromField(
                $actor,
                "system.attributes.death.success",
                death.success + 1
            )}
    >
        <i class="fas fa-check" />
    </button>

    <input
        class="death-saves__input"
        type="number"
        name="system.attributes.death.success"
        placeholder="0"
        min="0"
        data-tooltip="A5E.DeathSuccess"
        data-tooltip-direction="UP"
        value={death.success}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $actor,
                target.name,
                Number(target.value)
            )}
    />

    <div
        class="death-saves__icon u-align-center u-flex u-flex-col u-pos-relative"
    >
        <button
            class="death-saves__button"
            data-tooltip="A5E.DeathSavingThrowRoll"
            data-tooltip-direction="UP"
            on:click={$actor.rollDeathSavingThrow(
                getKeyPressAsOptions($pressedKeysStore)
            )}
        >
            <i class="fas fa-skull a5e-js-roll-death-saving-throw" />
        </button>
    </div>

    <input
        class="death-saves__input"
        type="number"
        name="system.attributes.death.failure"
        data-dtype="Number"
        placeholder="0"
        min="0"
        data-tooltip="A5E.DeathFailure"
        data-tooltip-direction="UP"
        value={death.failure}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $actor,
                target.name,
                Number(target.value)
            )}
    />

    <button
        class="death-saves__button"
        on:click={() =>
            updateDocumentDataFromField(
                $actor,
                "system.attributes.death.failure",
                death.failure + 1
            )}
    >
        <i class="fas fa-times" />
    </button>
</div>

<style lang="scss">
    .death-saves {
        display: flex;
        align-items: center;
        gap: 0.25rem;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 5;

        border-radius: 5px;
        padding: 0.5rem;

        background: rgba(139, 37, 37, 0.85);
        color: rgba(255 255 255 / 0.75);

        &__icon {
            cursor: pointer;
            font-size: $font-size-lg;
            transition: $standard-transition;

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
            font-size: $font-size-md;
            text-align: center;
            padding: 0;

            &:active,
            &:focus {
                box-shadow: none;
            }
        }
    }
</style>
