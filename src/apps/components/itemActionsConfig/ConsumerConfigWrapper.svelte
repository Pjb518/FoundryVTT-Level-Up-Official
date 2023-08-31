<script>
    import { getContext } from "svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    export let consumerId;

    function deleteConsumer(event) {
        const { consumerId } = event.target.closest(".consumer").dataset;

        $item.update({
            [`system.actions.${actionId}.consumers`]: {
                [`-=${consumerId}`]: null,
            },
        });
    }
</script>

<li class="consumer" data-consumer-id={consumerId}>
    <article class="config-wrapper">
        <div class="button-wrapper">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <i
                class="button button--delete fas fa-trash"
                on:click={deleteConsumer}
            />
        </div>

        <slot />
    </article>
</li>

<style lang="scss">
    .button-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        color: #999;
        font-size: $font-size-md;
    }

    .config-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        position: relative;
        padding: 0.75rem;
        font-size: $font-size-sm;
        // background: rgba(246, 242, 235, 0.4);
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
    }

    .button {
        margin: 0;
        padding: 0.25rem;
        cursor: pointer;
        transition: $standard-transition;

        &:hover {
            transform: scale(1.2);
        }
    }

    .button {
        margin: 0;
        padding: 0.25rem;
        cursor: pointer;
        transition: $standard-transition;

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &--delete:hover {
            color: $color-secondary;
        }
    }

    .consumer {
        display: flex;
        flex-direction: column;
    }
</style>
