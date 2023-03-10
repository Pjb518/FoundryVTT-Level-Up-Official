<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";
    import prepareXP from "../../dataPreparationHelpers/prepareXP";

    const actor = getContext("actor");

    $: xp = prepareXP($actor);
    $: isElite = $actor.system.details.elite;
    $: sheetIsLocked = $actor.flags.a5e?.sheetIsLocked ?? true;
</script>

<div class="level-container">
    {#if isElite || !sheetIsLocked}
        <div class="level-box">
            <label class="xp-label" for="{$actor.id}-elite">Elite</label>

            <!-- svelte-ignore a11y-click-events-have-key-events -->
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
            type="number"
            name="system.details.cr"
            value={$actor.system.details.cr}
            placeholder="0"
            min="0"
            disabled={sheetIsLocked}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value)
                )}
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
            value={$actor.system.prof}
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

    .level-box {
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
        padding-inline: 0.125rem;
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

    .shield-elite {
        font-size: 1rem;
        border: 0;
        padding: 0.125rem;
        transition: all 0.15s ease-in-out;

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
