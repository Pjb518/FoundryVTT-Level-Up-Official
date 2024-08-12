<script>
    import calculateHeaderTextColor from "../../utils/calculateHeaderTextColor";

    export let actorName;
    export let img;
    export let messageDocument;

    const headerBackgroundColor = messageDocument.author.color;
    const headerTextColor = calculateHeaderTextColor(headerBackgroundColor);

    const { timeSince } = foundry.utils;
</script>

<header
    class="a5e-chat-card__header"
    style="--a5e-user-background-color: {headerBackgroundColor}; --a5e-user-text-color: {headerTextColor};"
>
    <img class="a5e-chat-card__header__img" src={img} alt={actorName} />

    <span>{actorName}</span>

    <time class="message-timestamp">
        {timeSince(messageDocument.timestamp)}
    </time>

    <!-- svelte-ignore a11y-missing-attribute -->
    <a aria-label="Delete" class="message-delete">
        <i class="fas fa-trash" />
    </a>
</header>

<style lang="scss">
    a {
        padding: 0;
    }
</style>
