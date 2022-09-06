<script>
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

    export let actionId;
    export let item;
    export let roll;
    export let rollId;
</script>

<li class="roll" data-roll-id={rollId}>
    <div class="config-wrapper">
        <slot />
    </div>

    <div class="button-wrapper">
        {#if roll.type !== "attack"}
            <i class="button fa-solid fa-clone" on:click={duplicateRoll} />
        {/if}

        <i class="button delete-button fas fa-trash" on:click={deleteRoll} />
    </div>
</li>

<style lang="scss">
    .button-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-left: auto;
        padding: 0.125rem 0.5rem;
        background: #ccc;
    }

    .config-wrapper {
        padding: 0.5rem;
        background: #ccc;
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

    .delete-button {
        color: #8b2525;
    }

    .roll {
        display: flex;
        flex-direction: column;
    }
</style>
