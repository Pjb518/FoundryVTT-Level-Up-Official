<script>
    import { createEventDispatcher } from "svelte";

    import calculateHeaderTextColor from "../../utils/calculateHeaderTextColor";

    export let actorName;
    export let img;
    export let messageDocument;

    const headerBackgroundColor = messageDocument.author.color;
    const headerTextColor = calculateHeaderTextColor(headerBackgroundColor);

    const { timeSince } = foundry.utils;
    const dispatch = createEventDispatcher();
    const isGM = game.user.isGM;
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
                class="a5e-chat-card__header__button--repeat fas fa-undo"
                data-tooltip="Repeat Roll"
                data-tooltip-direction="LEFT"
                on:click={() => dispatch("repeatCard")}
            />

            {#if isGM}
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                    aria-label="Delete"
                    class="message-delete a5e-chat-card__header__button--delete"
                >
                    <i class="fas fa-trash" />
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
