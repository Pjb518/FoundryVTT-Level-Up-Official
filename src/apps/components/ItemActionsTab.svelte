<script>
    import { getContext } from "svelte";

    const item = getContext("item");

    function addAction() {
        const actions = $item.system.actions;
        const newActionId = foundry.utils.randomID();

        $item.update({ "system.actions": { ...actions, [newActionId]: {} } });
    }

    function deleteAction(event) {
        const { actionId } = event.target.closest(".action").dataset;

        item.get("document").update({
            "system.actions": {
                [`-=${actionId}`]: null,
            },
        });
    }
</script>

<header class="actions-header">
    <h2 class="tab-heading">Actions</h2>

    <a on:click={addAction}>+ Add Action</a>
</header>

<ul class="action-list">
    {#each Object.entries($item.system.actions) as [id, action] (id)}
        <li class="action" data-action-id={id}>
            {id}
            <div>
                <i class="delete-button fas fa-trash" on:click={deleteAction} />
            </div>
        </li>
    {/each}
</ul>

<style lang="scss">
    .action {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 3px;
    }

    .action-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0;
        margin: 0;
        list-style: none;
        font-family: "Modesto Condensed", serif;
    }

    .actions-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        padding: 0 0.25rem 0.25rem 0.25rem;
    }

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

    .tab-heading {
        font-family: "Modesto Condensed", serif;
    }
</style>
