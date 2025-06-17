<script lang="ts">
    import { getContext } from "svelte";
    import calculateHeaderTextColor from "#utils/calculateHeaderTextColor.ts";

    type Props = {
        actorName: string;
        img: string;

        onRepeatCard: () => void;
    };

    let { actorName, img, onRepeatCard }: Props = $props();
    let messageDocument: any = getContext("message");

    const headerBackgroundColor = messageDocument.author.color;
    const headerTextColor = calculateHeaderTextColor(headerBackgroundColor);

    const { timeSince } = foundry.utils;
    const isGM = game.user?.isGM!;
    const isOwner = messageDocument.author.id === game.userId;
</script>

<header
    class="a5e-chat-card__header a5e-chat-card__header--roll"
    style="--a5e-user-background-color: {headerBackgroundColor}; --a5e-user-text-color: {headerTextColor};"
>
    <img class="a5e-chat-card__header__img" src={img} alt={actorName} />

    <span class="a5e-chat-card__header__title">{actorName}</span>

    <time class="message-timestamp a5e-chat-card__header__time">
        {timeSince(messageDocument.timestamp)}
    </time>

    {#if isGM || isOwner}
        <span class="a5e-chat-card__header__buttons">
            <button
                class="a5e-chat-card__header__button--repeat"
                data-tooltip="Repeat Roll"
                data-tooltip-direction="LEFT"
                aria-label="Repeat Roll"
                onclick={() => onRepeatCard()}
            >
                <i class="fa-solid fa-undo"></i>
            </button>

            {#if isGM}
                <!-- svelte-ignore a11y_missing_attribute -->
                <a
                    aria-label="Delete"
                    class="message-delete a5e-chat-card__header__button--delete"
                >
                    <i class="icon fas fa-trash"></i>
                </a>
            {/if}
        </span>
    {/if}
</header>

<style lang="scss">
    a {
        padding: 0;
    }
</style>
