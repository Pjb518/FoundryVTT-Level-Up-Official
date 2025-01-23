<script>
    import { createEventDispatcher, getContext } from "svelte";

    import calculateHeaderTextColor from "../../utils/calculateHeaderTextColor";
    import zip from "../../utils/zip";

    export let messageDocument;

    const message = getContext("message");

    const headerBackgroundColor = messageDocument.author.color;
    const headerTextColor = calculateHeaderTextColor(headerBackgroundColor);

    const { timeSince } = foundry.utils;
    const dispatch = createEventDispatcher();

    $: actor = $message.actor;
    $: token = $message.token;

    $: img = token?.texture?.src ?? actor?.img ?? "";
    $: actorName = token?.name ?? actor?.name ?? "";

    $: showCritDamageToggle = ($message?.system?.rollData ?? []).some(
        (roll) =>
            roll.type === "damage" &&
            (roll.canCrit ?? true) &&
            roll.critRoll &&
            roll.baseRoll,
    );

    $: critDamageEnabled = zip(
        $message.rolls ?? [],
        $message?.system?.rollData ?? [],
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

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
        class="a5e-chat-card__header__title"
        role="button"
        tabindex="0"
        on:click={() => dispatch("toggleDescription")}
    >
        {actorName}
    </span>

    <time class="message-timestamp a5e-chat-card__header__time">
        {timeSince(messageDocument.timestamp)}
    </time>

    <span class="a5e-chat-card__header__buttons">
        {#if showCritDamageToggle}
            <button
                class="a5e-chat-card__header__button--crit-toggle fa-solid fa-bullseye"
                class:a5e-chat-card__header__button--crit-toggle--crit={critDamageEnabled}
                data-tooltip="Toggle Critical Damage"
                data-tooltip-direction="LEFT"
                on:click|stopPropagation={() => dispatch("toggleCriticalDamage")}
            />
        {/if}

        <button
            class="a5e-chat-card__header__button--repeat fas fa-undo"
            data-tooltip="Repeat Roll"
            data-tooltip-direction="LEFT"
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
