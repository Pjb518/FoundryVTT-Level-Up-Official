<script lang="ts">
    import { getContext } from "svelte";
    import calculateHeaderTextColor from "#utils/calculateHeaderTextColor.ts";

    type Props = {
        tableName: string;
        img: string;
    };

    let { tableName, img }: Props = $props();

    let messageDocument: any = getContext("message");

    const headerBackgroundColor = messageDocument.author.color;
    const headerTextColor = calculateHeaderTextColor(headerBackgroundColor);

    const isGM = game.user?.isGM!;

    const { timeSince } = foundry.utils;
</script>

<header
    class="a5e-chat-card__header a5e-chat-card__header--roll"
    style="--a5e-user-background-color: {headerBackgroundColor}; --a5e-user-text-color: {headerTextColor};"
>
    <img class="a5e-chat-card__header__img" src={img} alt={tableName} />

    <span class="a5e-chat-card__header__title">{tableName}</span>

    <time class="message-timestamp a5e-chat-card__header__time">
        {timeSince(messageDocument.timestamp)}
    </time>

    <span class="a5e-chat-card__header__buttons">
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
</header>

<style lang="scss">
    a {
        padding: 0;
    }
</style>
