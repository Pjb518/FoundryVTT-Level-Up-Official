<script lang="ts">
    import { getContext } from "svelte";

    import calculateHeaderTextColor from "#utils/calculateHeaderTextColor.ts";
    import zip from "#utils/zip.ts";

    type Props = {
        onRepeatCard: () => void;
        onToggleDescription: () => void;
        onToggleCriticalDamage: () => void;
    };

    let { onRepeatCard, onToggleDescription, onToggleCriticalDamage }: Props = $props();

    let message: any = getContext("message");

    const headerBackgroundColor = message.author.color;
    const headerTextColor = calculateHeaderTextColor(headerBackgroundColor);

    const { timeSince } = foundry.utils;
    const isGM = game.user.isGM;
    const isOwner = message?.author.id === game.userId;

    let actor = message?.actor;
    let token = message?.token;

    let img = token?.texture?.src ?? actor?.img ?? "";
    let actorName = token?.name ?? actor?.name ?? "";

    let showCritDamageToggle = (message?.system?.rollData ?? []).some(
        (roll) =>
            roll.type === "damage" &&
            (roll.canCrit ?? true) &&
            roll.critRoll &&
            roll.baseRoll,
    );

    let critDamageEnabled = zip(
        message?.rolls ?? [],
        message?.system?.rollData ?? [],
    ).some(([roll, rollData]) => {
        if (rollData.type !== "damage") return false;
        if (!rollData.canCrit ?? true) return false;
        if (!rollData.critRoll || !rollData.baseRoll) return false;

        if (rollData.baseRoll.formula === roll.formula) return false;

        return true;
    });
</script>

<!-- TODO: Display Token when hovered -->
<header
    class="a5e-chat-card__header a5e-chat-card__header--item"
    style="--a5e-user-background-color: {headerBackgroundColor}; --a5e-user-text-color: {headerTextColor};"
>
    <img class="a5e-chat-card__header__img" src={img} alt={actorName} />

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <span
        class="a5e-chat-card__header__title"
        role="button"
        tabindex="0"
        onclick={() => onToggleDescription()}
    >
        {actorName}
    </span>

    <time class="message-timestamp a5e-chat-card__header__time">
        {timeSince(message?.timestamp)}
    </time>

    {#if isGM || isOwner}
        <span class="a5e-chat-card__header__buttons">
            {#if showCritDamageToggle}
                <button
                    class="a5e-button a5e-chat-card__header__button--crit-toggle"
                    class:a5e-chat-card__header__button--crit-toggle--crit={critDamageEnabled}
                    data-tooltip="Toggle Critical Damage"
                    data-tooltip-direction="LEFT"
                    aria-label="Toggle Critical Damage"
                    onclick={(e) => {
                        e.stopPropagation();
                        onToggleCriticalDamage();
                    }}
                >
                    <i class="fa-solid fa-bullseye"></i>
                </button>
            {/if}

            <button
                class="a5e-button a5e-chat-card__header__button--repeat"
                data-tooltip="Repeat Roll"
                data-tooltip-direction="LEFT"
                aria-label="Repeat Roll"
                onclick={() => onRepeatCard()}
            >
                <i class="fa-solid fa-undo"></i>
            </button>

            {#if isGM}
                <!-- svelte-ignore a11y_missing_attribute -->
                <button
                    type="button"
                    aria-label="Delete"
                    class="message-delete a5e-chat-card__header__button--delete"
                    onclick={(e) => {
                        e.stopPropagation();
                        message?.delete();
                    }}
                >
                    <i class="fas fa-trash"></i>
                </button>
            {/if}
        </span>
    {/if}
</header>
