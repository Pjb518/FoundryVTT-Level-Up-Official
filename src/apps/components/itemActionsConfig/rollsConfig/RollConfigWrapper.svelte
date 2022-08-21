<script>
    function deleteRoll(event) {
        const { rollId } = event.target.closest(".roll").dataset;

        item.get("document").update({
            [`system.actions.${actionId}.rolls`]: {
                [`-=${rollId}`]: null,
            },
        });
    }

    export let actionId;
    export let rollId;
</script>

<li class="roll" data-roll-id={rollId}>
    <slot />
    <i class="delete-button fas fa-trash" on:click={deleteRoll} />
</li>

<style lang="scss">
    .delete-button {
        color: #8b2525;
        margin-left: auto;
        margin-right: 0.5rem;
        padding: 0.25rem;
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
            transform: scale(1.2);
        }
    }

    .roll {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        border: 1px solid #bbb;
        border-radius: 3px;
        font-size: 1rem;
    }
</style>
