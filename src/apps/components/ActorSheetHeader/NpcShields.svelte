<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    import prepareXP from "../../dataPreparationHelpers/prepareXP";

    const actor = getContext("actor");

    function updateCr(target) {
        const { value } = target;
        let newValue;

        if (value === "1/2") newValue = 0.5;
        else if (value === "1/4") newValue = 0.25;
        else if (value === "1/8") newValue = 0.125;
        else newValue = parseInt(value, 10);

        if (isNaN(newValue)) newValue = $actor.system.details.cr;
        updateDocumentDataFromField($actor, target.name, newValue);
    }

    function displayCr(cr) {
        if (cr === 0.5) return "1/2";
        else if (cr === 0.25) return "1/4";
        else if (cr === 0.125) return "1/8";

        return cr;
    }

    $: cr = displayCr($actor.system.details.cr);
    $: xp = prepareXP($actor);
    $: isElite = $actor.system.details.elite;
    $: sheetIsLocked = $actor.flags.a5e?.sheetIsLocked ?? true;
</script>

<div class="level-container">
    {#if isElite || !sheetIsLocked}
        <div class="level-box">
            <label class="xp-label" for="{$actor.id}-elite">Elite</label>

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <i
                class="fas fa-skull shield-elite"
                class:shield-elite--unlocked={!sheetIsLocked}
                class:shield-elite--active={isElite}
                on:click={() => (!sheetIsLocked ? $actor.toggleElite() : null)}
            />
        </div>
    {/if}

    <div class="level-box">
        <label class="xp-label" for="{$actor.id}-cr">CR</label>

        <input
            id="{$actor.id}-cr"
            class="xp-input"
            type="text"
            name="system.details.cr"
            value={cr}
            placeholder="0"
            min="0"
            disabled={sheetIsLocked}
            on:change={({ target }) => updateCr(target)}
            on:click={({ target }) => !sheetIsLocked && target.select()}
        />
    </div>

    <div class="level-box">
        <label class="xp-label" for="{$actor.id}-xp"> XP </label>

        <input
            id="{$actor.id}-xp"
            class="xp-input"
            type="number"
            value={xp}
            placeholder="0"
            min="0"
            disabled
        />
    </div>

    <div class="level-box">
        <label class="xp-label" for="{$actor.id}-prof"> Prof. </label>

        <input
            id="{$actor.id}-prof"
            class="xp-input"
            type="number"
            value={$actor.system.attributes.prof}
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
        font-family: $font-primary;
    }

    .level-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 4rem;
        padding: 0.125rem 0;
        color: #7e7960;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: $color-light-background;
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
        padding-inline: 0.125rem;
        font-size: $font-size-md;

        &:active,
        &:focus {
            outline: 0;
            box-shadow: none;
        }
    }

    .xp-label {
        font-size: $font-size-xs;
    }

    .shield-elite {
        font-size: 0.95rem;
        border: 0;
        padding: 0.125rem;
        transition: $standard-transition;

        &--unlocked {
            cursor: pointer;

            &:hover {
                transform: scale(1.2);
                color: #555;
            }
        }

        &--active {
            color: #772020;

            &:hover {
                color: #772020;
            }
        }
    }
</style>
