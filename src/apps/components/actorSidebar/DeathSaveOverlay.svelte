<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: death = $actor.system.attributes.death;
</script>

<div class="death-saves">
    <i class="fas fa-check" />

    <input
        class="death-saves__input"
        type="number"
        name="system.attributes.death.success"
        placeholder="0"
        min="0"
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
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <i
            class="fas fa-skull a5e-js-roll-death-saving-throw"
            on:click={$actor.rollDeathSavingThrow()}
        />
    </div>

    <div class="a5e-tooltip a5e-tooltip--death-save">
        {localize("A5E.DeathSavingThrowRoll")}
    </div>

    <input
        class="death-saves__input"
        type="number"
        name="system.attributes.death.failure"
        data-dtype="Number"
        placeholder="0"
        min="0"
        value={death.failure}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $actor,
                target.name,
                Number(target.value)
            )}
    />

    <i class="fas fa-times" />
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

        width: min-content;
        aspect-ratio: 1;
        padding: 0.5rem;
        border-radius: 100%;

        background: rgba(139, 37, 37, 0.95);
        color: rgba(255 255 255 / 0.75);

        &__icon {
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.15s ease-in-out;

            &:hover {
                color: #fff;
            }

            &:hover > .a5e-tooltip {
                display: block;
            }
        }

        &__input[type="number"] {
            border: 0;
            background: transparent;
            color: inherit;
            font-size: 1rem;
            text-align: center;
            padding: 0;

            &:active,
            &:focus {
                box-shadow: none;
            }
        }
    }
</style>
