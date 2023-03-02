<script>
    import { slide } from "svelte/transition";

    import ItemActionButtons from "./ItemActionButtons.svelte";
    import FeatureSummary from "./itemSummaries/FeatureSummary.svelte";
    import ManeuverSummary from "./itemSummaries/ManeuverSummary.svelte";
    import ObjectSummary from "./itemSummaries/ObjectSummary.svelte";
    import SpellSummary from "./itemSummaries/SpellSummary.svelte";

    export let item;
    let shiftHeld = false;
    let ctrlHeld = false;

    function getSummaryComponent(item) {
        switch (item.type) {
            case "feature":
                return FeatureSummary;
            case "maneuver":
                return ManeuverSummary;
            case "object":
                return ObjectSummary;
            case "spell":
                return SpellSummary;
        }
    }

    function onHover(event) {
        const { ctrlKey, shiftKey } = event;

        if (shiftKey) shiftHeld = true;
        else shiftHeld = false;

        if (ctrlKey) ctrlHeld = true;
        else ctrlHeld = false;
    }

    function onLeave(event) {
        shiftHeld = false;
        ctrlHeld = false;
    }

    let showDescription = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<li
    class="item-wrapper"
    draggable="true"
    on:click={() => {
        showDescription = !showDescription;
    }}
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
        class="item-image"
        class:item-image--shift={shiftHeld}
        class:item-image--ctrl={ctrlHeld}
        style="--background-image: url({item.img});"
        role="img"
        aria-labelledby={item.name}
        on:click|stopPropagation={() => item.activate()}
        on:mousemove={onHover}
        on:mouseleave={onLeave}
    />

    {item.name}

    <ItemActionButtons {item} />
</li>

{#if showDescription}
    <div class="description-wrapper" transition:slide>
        <svelte:component this={getSummaryComponent(item)} {item} />

        {@html item.system.description}
    </div>
{/if}

{#if item.actions.count > 1}
    <ul class="actions-list">
        {#each item.actions.entries() as [id, action]}
            <li class="item-wrapper" draggable="false">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <span
                    class="item-image"
                    class:item-image--shift={shiftHeld}
                    class:item-image--ctrl={ctrlHeld}
                    style="--background-image: url({action.img});"
                    role="img"
                    aria-labelledby={action.name}
                    on:click|stopPropagation={() => item.activate(id)}
                    on:mousemove={onHover}
                    on:mouseleave={onLeave}
                />

                {action.name}
            </li>
        {/each}
    </ul>
{/if}

<style lang="scss">
    .actions-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0;
        padding: 0 0 0 1rem;
    }

    .description-wrapper {
        padding: 0.125rem 0.25rem;
    }

    .item-wrapper {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        height: fit-content;
        width: 100%;
        gap: 0.5rem;
        padding: 0.125rem;
        border: 1px solid #ccc;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.05);
        cursor: pointer;
    }

    .item-image {
        position: relative;
        height: 1.75rem;
        width: 1.75rem;
        background: no-repeat center/100% var(--background-image);
        border-radius: 3px;
        transition: all 0.15s ease-in-out;

        &:hover {
            background: no-repeat center/100% url("/icons/svg/d20.svg");
        }

        &--shift {
            filter: invert(34%) sepia(4%) saturate(4360%) hue-rotate(143deg)
                brightness(78%) contrast(65%);
        }

        &--ctrl {
            filter: invert(15%) sepia(27%) saturate(4731%) hue-rotate(338deg)
                brightness(101%) contrast(95%);
        }
    }
</style>
