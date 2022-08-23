<script>
    import { getContext } from "svelte";

    import getRequiredExperiencePoints from "../../utils/getRequiredExperiencePoints";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let requiredXP;

    const actor = getContext("actor");
    $: requiredXP = getRequiredExperiencePoints($actor);
</script>

<div class="level-container">
    <div class="level-box">
        <label class="xp-label" for="{$actor.id}-level">Level</label>

        <input
            id="{$actor.id}-level"
            class="xp-input"
            type="number"
            name="system.details.level"
            value={$actor.system.details.level}
            placeholder="0"
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

    <div class="xp-box">
        <label class="xp-label" for="{$actor.id}-current-xp">Current XP</label>

        <input
            id="{$actor.id}-current-xp"
            class="xp-input"
            type="number"
            name="system.details.xp"
            value={$actor.system.details.xp}
            placeholder="0"
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

    <div class="xp-box">
        <label class="xp-label" for="{$actor.id}-required-xp">
            Required XP
        </label>

        <input
            id="{$actor.id}-required-xp"
            class="xp-input"
            type="number"
            value={requiredXP}
            placeholder="0"
            min="0"
            disabled
        />
    </div>
</div>

<style lang="scss">
    .level-container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        border-radius: 4px;
        height: 100%;
        font-family: "Modesto Condensed", serif;
    }

    .level-box,
    .xp-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 4rem;
        padding: 0.125rem 0;
        color: #7e7960;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #f6f2eb;
        box-shadow: 0 0 5px #ccc inset;
        z-index: 4;
    }

    .level-box {
        width: 3rem;
    }

    .xp-input {
        height: unset;
        text-align: center;
        border: 0;
        background: transparent;
        padding-left: 0.125rem;
        padding-right: 0.125rem;
        font-size: 1rem;

        &:active,
        &:focus {
            outline: 0;
            box-shadow: none;
        }
    }

    .xp-label {
        font-size: 0.694rem;
    }
</style>
