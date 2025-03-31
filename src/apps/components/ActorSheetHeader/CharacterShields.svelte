<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/util/i18n";

    import getRequiredExperiencePoints from "../../../utils/getRequiredExperiencePoints";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    function isLevelLocked() {
        if (sheetIsLocked) return true;
        if (Object.keys($actor.classes ?? {}).length) return true;

        return false;
    }

    function getCharacterLevel() {
        if (!Object.keys($actor.classes ?? {}).length)
            return $actor.system.details.level;

        return $actor.levels.character;
    }

    function getLevelSource() {
        if (!Object.keys($actor.classes ?? {}).length) return "";

        const data = Object.values($actor.classes ?? {}).map((cls) => {
            return `${cls.name} (${cls.classLevels})`;
        }, []);

        return data.join(" / ");
    }

    $: characterLevel = getCharacterLevel($actor);
    $: levelSource = getLevelSource($actor);
    $: hasInspiration = $actor.system.attributes.inspiration;
    $: requiredXP = getRequiredExperiencePoints($actor);
    $: sheetIsLocked = $actor.flags.a5e?.sheetIsLocked ?? true;
    $: levelIsLocked = isLevelLocked($actor, sheetIsLocked);
</script>

<div class="character-shields__container">
    <div class="a5e-details-box character-shields__box">
        <label class="a5e-details-box__label" for="{$actor.id}-inspiration">
            {localize("A5E.Inspiration")}
        </label>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <i
            class="icon fas fa-dice-d20 shield-inspiration"
            class:shield-inspiration--active={hasInspiration}
            class:disable-pointer-events={!$actor.isOwner}
            on:click={() => $actor.toggleInspiration()}
        />
    </div>

    <div class="a5e-details-box character-shields__box">
        <label class="a5e-details-box__label" for="{$actor.id}-level"
            >Level</label
        >

        <input
            id="{$actor.id}-level"
            class="a5e-details-box__input"
            class:disable-pointer-events={!$actor.isOwner}
            data-tooltip={levelSource}
            data-tooltip-direction="DOWN"
            type="number"
            name="system.details.level"
            value={characterLevel}
            placeholder="0"
            min="0"
            disabled={levelIsLocked}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value),
                )}
            on:click={({ target }) => target.select()}
        />
    </div>

    <div class="a5e-details-box character-shields__box">
        <label class="a5e-details-box__label" for="{$actor.id}-prof">
            Prof.
        </label>

        <input
            id="{$actor.id}-prof"
            class="a5e-details-box__input"
            type="number"
            value={$actor.system.attributes.prof}
            placeholder="0"
            min="0"
            disabled
        />
    </div>

    {#if $actor.flags?.a5e?.showXP ?? true}
        <div class="a5e-details-box character-shields__box">
            <label class="a5e-details-box__label" for="{$actor.id}-current-xp">
                Current XP
            </label>

            <input
                id="{$actor.id}-current-xp"
                class="a5e-details-box__input"
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
                        Number(target.value),
                    )}
                on:click={({ target }) => target.select()}
            />
        </div>

        <div class="a5e-details-box character-shields__box">
            <label class="a5e-details-box__label" for="{$actor.id}-required-xp">
                Required XP
            </label>

            <input
                id="{$actor.id}-required-xp"
                class="a5e-details-box__input"
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
    @use "sass:color";

    .character-shields__container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        border-radius: 4px;
        height: 100%;
        font-family: var(--a5e-font-primary);
    }

    .character-shields__box {
        width: 3rem;
    }

    .disable-pointer-events {
        pointer-events: none;
    }

    .shield-inspiration {
        font-size: var(--a5e-text-size-md);
        color: var(--a5e-button-gray);
        border: 0;
        padding: 0.125rem;
        transition: var(--a5e-transition-standard);
        cursor: pointer;

        &:hover {
            transform: scale(1.2);
            color: var(--a5e-button-gray-hover);
        }

        &--active {
            color: var(--a5e-button-primary);

            &:hover {
                color: var(--a5e-button-primary);
            }
        }
    }
</style>
