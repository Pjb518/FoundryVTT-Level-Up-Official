<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getRequiredExperiencePoints from "../../../utils/getRequiredExperiencePoints";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: hasInspiration = $actor.system.attributes.inspiration;
    $: requiredXP = getRequiredExperiencePoints($actor);
    $: sheetIsLocked = $actor.flags.a5e?.sheetIsLocked ?? true;
</script>

<div class="character-shields__container">
    <div class="character-shields__box">
        <label class="xp-label" for="{$actor.id}-inspiration">
            {localize("A5E.Inspiration")}
        </label>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <i
            class="fas fa-dice-d20 shield-inspiration"
            class:shield-inspiration--active={hasInspiration}
            class:disable-pointer-events={!$actor.isOwner}
            on:click={() => $actor.toggleInspiration()}
        />
    </div>

    <div class="character-shields__box">
        <label class="xp-label" for="{$actor.id}-level">Level</label>

        <input
            id="{$actor.id}-level"
            class="xp-input"
            class:disable-pointer-events={!$actor.isOwner}
            type="number"
            name="system.details.level"
            value={$actor.system.details.level}
            placeholder="0"
            min="0"
            disabled={sheetIsLocked}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value)
                )}
            on:click={({ target }) => target.select()}
        />
    </div>

    <div class="character-shields__box">
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

    {#if $actor.flags?.a5e?.showXP ?? true}
        <div class="xp-box">
            <label class="xp-label" for="{$actor.id}-current-xp">
                Current XP
            </label>

            <input
                id="{$actor.id}-current-xp"
                class="xp-input"
                class:disable-pointer-events={!$actor.isOwner}
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
    {/if}
</div>

<style lang="scss">
    .character-shields__container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        border-radius: 4px;
        height: 100%;
        font-family: $font-primary;
    }

    .character-shields__box,
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
        background: $color-light-background;
        box-shadow: 0 0 5px #ccc inset;
        z-index: 4;
    }

    .character-shields__box {
        width: 3rem;
    }

    .disable-pointer-events {
        pointer-events: none;
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
        font-size: 0.694rem;
    }

    .shield-inspiration {
        font-size: $font-size-md;
        color: #bbbaba;
        border: 0;
        padding: 0.125rem;
        transition: $standard-transition;
        cursor: pointer;

        &:hover {
            transform: scale(1.2);
            color: #444;
        }

        &--active {
            color: darken(#2b6537, 10%);

            &:hover {
                color: #2b6537;
            }
        }
    }
</style>
