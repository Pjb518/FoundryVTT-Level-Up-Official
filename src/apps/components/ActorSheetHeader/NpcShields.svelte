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
        else newValue = Number.parseInt(value, 10);

        if (Number.isNaN(newValue)) newValue = $actor.system.details.cr;
        updateDocumentDataFromField($actor, target.name, newValue);
    }

    function displayCr(cr) {
        if (cr === 0.5) return "1/2";
        if (cr === 0.25) return "1/4";
        if (cr === 0.125) return "1/8";

        return cr;
    }

    $: cr = displayCr($actor.system.details.cr);
    $: xp = prepareXP($actor);
    $: isElite = $actor.system.details.elite;
    $: sheetIsLocked = $actor.flags.a5e?.sheetIsLocked ?? true;
</script>

<div class="level-container">
    {#if isElite || !sheetIsLocked}
        <div class="a5e-details-box">
            <label class="a5e-details-box__label" for="{$actor.id}-elite">Elite</label>

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

    <div class="a5e-details-box">
        <label class="a5e-details-box__label" for="{$actor.id}-cr">CR</label>

        <input
            id="{$actor.id}-cr"
            class="a5e-details-box__input"
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

    <div class="a5e-details-box">
        <label class="a5e-details-box__label" for="{$actor.id}-xp"> XP </label>

        <span class="a5e-details-box__input" value={xp}>
            {xp}
        </span>
    </div>

    <div class="a5e-details-box">
        <label class="a5e-details-box__label" for="{$actor.id}-prof"> Prof. </label>

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
</div>

<style lang="scss">
    .level-container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        border-radius: 4px;
        height: 100%;
        font-family: var(--a5e-font-primary);
    }

    .shield-elite {
        font-size: 0.95rem;
        border: 0;
        padding: 0.125rem;
        transition: var(--a5e-transition-standard);
        color: var(--a5e-button-gray);

        &--unlocked {
            cursor: pointer;

            &:hover {
                transform: scale(1.2);
                color: var(--a5e-button-gray-hover);
            }
        }

        &--active {
            color: var(--a5e-button-error);

            &:hover {
                color: var(--a5e-button-error);
            }
        }
    }
</style>
