<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { prepareXP } from "#utils/view/helpers/prepareXP.ts";
    import getRequiredExperiencePoints from "#utils/getRequiredExperiencePoints.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");
    let actorStore = $derived(actor.reactive.system);

    function displayCr(cr: number) {
        if (!cr) return "0";
        if (cr === 0.5) return "1/2";
        if (cr === 0.25) return "1/4";
        if (cr === 0.125) return "1/8";

        return cr.toString();
    }

    function getCharacterLevel() {
        if (actor.type !== "character") return 1;
        if (!Object.keys(actor.classes ?? {}).length) return actorStore.details.level;

        return actor.levels.character;
    }

    function isLevelLocked() {
        if (actor.type !== "character") return true;
        if (sheetIsLocked()) return true;
        if (Object.keys(actor.classes ?? {}).length > 0) return true;
        return false;
    }

    function getLevelSource() {
        if (actor.type !== "character") return "";
        if (!Object.keys(actor.classes ?? {}).length) return "";

        const data = Object.values(actor.classes ?? {}).map((cls: any) => {
            return `${cls.name} ${cls.classLevels}`;
        });

        return data.join(" / ");
    }

    function showXP() {
        if (actor.type == "npc") return true;
        return actor.flags?.a5e?.showXP ?? true;
    }

    function toggleElite() {
        updateDocumentDataFromField(
            actor,
            "system.details.elite",
            !actor.system.details.elite,
        );
    }

    function toggleInspiration() {
        updateDocumentDataFromField(
            actor,
            "system.attributes.inspiration",
            !actor.system.attributes.inspiration,
        );
    }

    function updateCr(target: any) {
        const { value } = target;
        let newValue: number;

        if (value === "1/2") newValue = 0.5;
        else if (value === "1/4") newValue = 0.25;
        else if (value === "1/8") newValue = 0.125;
        else newValue = Number.parseInt(value, 10);

        if (Number.isNaN(newValue)) newValue = actor.system.details.cr;
        updateDocumentDataFromField(actor, "system.details.cr", newValue);
    }

    let data = $derived({
        characterLevel: getCharacterLevel(),
        cr: displayCr(actorStore.details.cr),
        levelSource: getLevelSource(),
        levelIsLocked: isLevelLocked(),
        requiredXP: getRequiredExperiencePoints(actor),
        showXP: showXP(),
        xp: actor.type === "character" ? actorStore.details.xp : prepareXP(actor),
    });
</script>

<div class="a5e-actor-header-shields__container">
    {#if actor.type === "character"}
        <!-- Inspiration -->
        <div class="a5e-actor-details-box">
            <label for="{actor.id}-inspiration" class="a5e-actor-details-box__label">
                {localize("A5E.consumers.inspiration")}
            </label>

            <button
                class="a5e-actor-details-box__button"
                class:a5e-actor-details-box__button--selected={actorStore.attributes
                    .inspiration}
                aria-labelledby="Inspiration"
                onclick={() => toggleInspiration()}
            >
                <i class="fa-solid fa-dice-d20"></i>
            </button>
        </div>
    {/if}

    <!-- Elite -->
    {#if actor.type === "npc"}
        <div class="a5e-actor-details-box">
            <label for="{actor.id}-elite" class="a5e-actor-details-box__label">
                {localize("A5E.details.creature.labels.elite")}
            </label>

            <button
                class="a5e-actor-details-box__button"
                class:a5e-actor-details-box__button--selected={actorStore.details.elite}
                aria-labelledby="Elite"
                onclick={() => toggleElite()}
            >
                <i class="fa-solid fa-skull"></i>
            </button>
        </div>
    {/if}

    {#if actor.type === "character"}
        <!-- Level -->
        <div class="a5e-actor-details-box">
            <label for="{actor.id}-level" class="a5e-actor-details-box__label">
                Level
            </label>

            <input
                id="{actor.id}-level"
                class="a5e-actor-details-box__input"
                class:a5e-disable-pointer-events={!actor.isOwner}
                data-tooltip={data.levelSource}
                data-tooltip-direction="DOWN"
                type="number"
                value={data.characterLevel}
                placeholder="0"
                min="0"
                disabled={data.levelIsLocked}
                onchange={({ target }) =>
                    updateDocumentDataFromField(
                        actor,
                        "system.details.level",
                        Number(target?.value),
                    )}
            />
        </div>
    {/if}

    <!-- Proficiency -->
    <div class="a5e-actor-details-box">
        <label for="{actor.id}-prof" class="a5e-actor-details-box__label"> Prof. </label>

        <input
            id="{actor.id}-prof"
            class="a5e-actor-details-box__input"
            type="number"
            value={actorStore.attributes.prof}
            placeholder="0"
            min="0"
            disabled
        />
    </div>

    {#if actor.type === "npc"}
        <!-- CR -->
        <div class="a5e-actor-details-box">
            <label for="{actor.id}-cr" class="a5e-actor-details-box__label"> CR </label>

            <input
                id="{actor.id}-cr"
                class="a5e-actor-details-box__input"
                type="text"
                value={data.cr}
                placeholder="0"
                min="0"
                onchange={({ target }) => updateCr(target)}
            />
        </div>
    {/if}

    <!-- XP -->
    {#if data.showXP}
        <div class="a5e-actor-details-box">
            <label for="{actor.id}-current-xp" class="a5e-actor-details-box__label">
                {actor.type === "character" ? "Current XP" : "XP"}
            </label>

            <input
                id="{actor.id}-xp"
                class="a5e-actor-details-box__input"
                type="number"
                value={data.xp}
                placeholder="0"
                min="0"
                disabled={actor.type === "npc"}
                onchange={({ target }) =>
                    updateDocumentDataFromField(
                        actor,
                        "system.details.xp",
                        // @ts-ignore
                        Number(target.value),
                    )}
            />
        </div>

        <!-- Required XP -->
        {#if actor.type === "character"}
            <div class="a5e-actor-details-box">
                <label for="{actor.id}-required-xp" class="a5e-actor-details-box__label">
                    Required XP
                </label>

                <input
                    id="{actor.id}-required-xp"
                    class="a5e-actor-details-box__input"
                    type="number"
                    value={data.requiredXP}
                    placeholder="0"
                    min="0"
                    disabled
                />
            </div>
        {/if}
    {/if}
</div>

<style lang="scss">
    .a5e-actor-header-shields {
        &__container {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            border-radius: 4px;
            height: 100%;
            font-family: var(--a5e-condensed-font);
        }
    }

    .a5e-actor-details-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-self: center;
        width: 3.5rem;
        padding: 0.125rem 0;

        border: 1px solid var(--a5e-border-color);
        border-radius: 4px;

        &__label {
            font-size: var(--a5e-xs-text);
        }

        &__input {
            text-align: center;
            border: none;
            background: transparent;
            padding-inline: 0.25rem;
            font-size: var(--a5e-md-text);

            &:active,
            &:focus {
                outline: none;
                box-shadow: none;
            }
        }

        &__button {
            text-align: center;
            border: none;
            padding: 0.125rem 0.25rem;
            font-size: var(--a5e-md-text);
            background-color: transparent;
            cursor: pointer;
            color: var(--a5e-text-color-medium);
            transition: var(--a5e-transition-standard);

            &:focus,
            &:hover {
                color: var(--a5e-text-color-dark);
            }

            &--selected {
                color: var(--a5e-text-color-dark);
            }
        }
    }
</style>
