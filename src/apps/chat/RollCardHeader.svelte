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

    <span class="a5e-chat-card__header__buttons">
        <button
            class="a5e-chat-card__header__button--repeat fas fa-undo"
            on:click={() => dispatch("repeatCard")}
        />

        <!-- svelte-ignore a11y-missing-attribute -->
        <a
            aria-label="Delete"
            class="message-delete a5e-chat-card__header__button--delete"
        >
            <i class="fas fa-trash" />
        </a>
    </span>
</header>

<style lang="scss">
    a {
        padding: 0;
    }
</style>
