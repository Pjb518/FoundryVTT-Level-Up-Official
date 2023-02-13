<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import ConsumerConfigWrapper from "../itemActionsConfig/ConsumerConfigWrapper.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    function addConsumer() {
        $item.update({
            [`system.actions.${actionId}.consumers`]: {
                ...action.consumers,
                [foundry.utils.randomID()]: { type: "item" },
            },
        });
    }

    function deleteConsumer(event) {
        const { consumerId } = event.target.closest(".consumer").dataset;

        $item.update({
            [`system.actions.${actionId}.consumers`]: {
                [`-=${consumerId}`]: null,
            },
        });
    }

    $: action = $item.system.actions[actionId];
</script>

<section class="action-config action-config__wrapper">
    <header class="action-config__section-header">
        <h2 class="action-config__section-heading">
            {localize("A5E.TabConsumers")}
        </h2>

        <button class="add-button" on:click={() => addConsumer()}>
            {localize("A5E.ButtonAddConsumer")}
        </button>
    </header>

    <ul class="consumers-list">
        {#each Object.entries(action.consumers ?? {}) as [consumerId, consumer] (consumerId)}
            <li class="consumer" data-consumer-id={consumerId}>
                <article class="config-wrapper">
                    <div class="button-wrapper">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <i
                            class="button button--delete fas fa-trash"
                            on:click={deleteConsumer}
                        />
                    </div>

                    <ConsumerConfigWrapper {consumerId} {consumer} />
                </article>
            </li>
        {:else}
            <li class="action-config__none">{localize("A5E.None")}</li>
        {/each}
    </ul>
</section>

<style lang="scss">
    .consumers-list {
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        list-style: none;
    }

    .button-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        color: #999;
        font-size: 1rem;
    }

    .config-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        position: relative;
        padding: 0.75rem;
        font-size: 0.833rem;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
    }

    .button {
        margin: 0;
        padding: 0.25rem;
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
            transform: scale(1.2);
        }
    }

    .button {
        margin: 0;
        padding: 0.25rem;
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &--delete:hover {
            color: #8b2525;
        }
    }

    .consumer {
        display: flex;
        flex-direction: column;
    }
</style>
