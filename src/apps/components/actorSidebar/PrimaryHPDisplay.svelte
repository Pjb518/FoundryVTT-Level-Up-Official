<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let hp;
    const actor = getContext("actor");
</script>

<div class="hit-point-wrapper">
    <label class="hp-label" for="{$actor.id}-current-hp">Curr. HP</label>

    <input
        id="{$actor.id}-current-hp"
        class="current-hp"
        type="number"
        name="system.attributes.hp.value"
        value={hp.value}
        min="0"
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $actor,
                target.name,
                Number(target.value)
            )}
        on:click={({ target }) => target.select()}
    />
</div>

<div class="hit-point-wrapper">
    <label class="hp-label" for="{$actor.id}-max-hp">Max HP</label>

    <input
        id="{$actor.id}-max-hp"
        class="max-hp"
        type="number"
        name="system.attributes.hp.max"
        value={hp.max}
        min="0"
        disabled
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $actor,
                target.name,
                Number(target.value)
            )}
    />
</div>

<style lang="scss">
    .hit-point-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 3.5rem;
        font-size: 1rem;
        font-family: "Modesto Condensed", serif;
        color: #7e7960;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #f6f2eb;
        box-shadow: 0 0 10px #ccc inset;
        z-index: 4;
    }

    .divider {
        width: 100%;
        margin: 0;
        border: 0.5px solid #ccc;
    }

    .hp-label {
        font-size: 0.694rem;
    }

    .current-hp,
    .max-hp {
        text-align: center;
        border: 0;
        background: transparent;
        padding-left: 0.25rem;
        padding-right: 0.25rem;
        font-size: 1.2rem;

        &:active,
        &:focus {
            outline: 0;
            box-shadow: none;
        }
    }
</style>
