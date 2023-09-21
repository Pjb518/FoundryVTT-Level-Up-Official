<script>
    import { createEventDispatcher, getContext } from "svelte";

    import zip from "../../../utils/zip";

    export let altText;
    export let clickableHeader;
    export let img;
    export let title;
    export let subtitle = null;

    const dispatch = createEventDispatcher();
    const message = getContext("message");

    $: showCritDamageToggle = ($message?.flags?.a5e?.rollData ?? []).some(
        (roll) =>
            roll.type === "damage" &&
            roll.canCrit &&
            roll.critRoll &&
            roll.baseRoll
    );

    $: critDamageEnabled = zip(
        $message.rolls ?? [],
        $message?.flags?.a5e?.rollData ?? []
    ).some(([roll, rollData]) => {
        if (rollData.type !== "damage") return false;
        if (!rollData.canCrit) return false;
        if (!rollData.critRoll || !rollData.baseRoll) return false;

        if (rollData.baseRoll.formula === roll.formula) return false;

        return true;
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<header
    class="card-header"
    class:card-header--clickable={clickableHeader}
    role="button"
    tabindex="0"
    on:click={() => dispatch("toggleDescription")}
>
    <img class="card-image" src={img} alt={altText} />

    <div class="card-title-wrapper">
        <h2 class="card-title">{title}</h2>

        {#if subtitle}
            <h3 class="card-subtitle">{subtitle}</h3>
        {/if}
    </div>

    {#if showCritDamageToggle}
        <button
            class="crit-toggle-button"
            class:crit-toggle-button--crit={critDamageEnabled}
            data-tooltip="Toggle Critical Damage"
            data-tooltip-direction="LEFT"
            on:click|stopPropagation={() => dispatch("toggleCriticalDamage")}
        >
            <i class="fa-solid fa-bullseye" />
        </button>
    {/if}
</header>

<style lang="scss">
    .card-image {
        border: 0;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 4px;
        grid-area: image;
    }

    .card-header {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        padding-block: 0.25rem var(--bottom-padding, 0.5rem);

        &--clickable {
            cursor: pointer;
        }
    }

    .card-subtitle {
        font-size: $font-size-sm;
        color: #7e7960;
        grid-area: subtitle;
    }

    .card-subtitle,
    .card-title {
        margin-bottom: 0;
        border-bottom: 0;
    }

    .card-title {
        font-size: $font-size-md;
        font-weight: bold;
        grid-area: title;
    }

    .card-title-wrapper {
        display: flex;
        flex-direction: column;
    }

    .crit-toggle-button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2rem;
        width: 2rem;
        margin-left: auto;
        font-size: 1rem;
        color: #7e7960;
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid #ccc;
        border-radius: 3px;
        transition: all 0.15s ease-in-out;

        &:hover {
            color: #191813;
            box-shadow: none;
        }

        &--crit {
            border-color: darken($color-secondary, 5%);
            background: $color-secondary;
            color: lighten($color-secondary, 95%);

            &:hover {
                color: #fedd9e;
            }
        }

        i {
            margin: 0;
        }
    }
</style>
