<script>
    import { getContext } from "svelte";

    import FormSection from "../FormSection.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    function deleteRoll(event) {
        const { rollId } = event.target.closest(".roll").dataset;

        $item.update({
            [`system.actions.${actionId}.rolls`]: {
                [`-=${rollId}`]: null,
            },
        });
    }

    function duplicateRoll() {
        const newRoll = foundry.utils.duplicate(roll);

        $item.update({
            [`system.actions.${actionId}.rolls`]: {
                [foundry.utils.randomID()]: newRoll,
            },
        });
    }

    export let roll;
    export let rollId;
</script>

<li class="roll" data-roll-id={rollId}>
    <FormSection>
        <div class="button-wrapper">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            {#if roll.type !== "attack"}
                <i class="button fa-solid fa-clone" on:click={duplicateRoll} />
            {/if}

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <i
                class="button button--delete fas fa-trash"
                on:click={deleteRoll}
            />
        </div>

        <section class="roll-config-wrapper">
            <slot />
        </section>
    </FormSection>
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

    .roll {
        display: flex;
        flex-direction: column;
    }

    .roll-config-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
    }
</style>
