<script>
    import { getContext } from "svelte";

    import ActionConfigDialog from "../ActionConfigDialog";

    const item = getContext("item");

    function addAction() {
        const actions = $item.system.actions;

        const newAction = {
            name: "New Action",
        };

        $item.update({
            "system.actions": {
                ...actions,
                [foundry.utils.randomID()]: newAction,
            },
        });
    }

    function configureAction(event) {
        const { actionId } = event.target.closest(".action").dataset;

        const dialog = new ActionConfigDialog(item, actionId);

        dialog.render(true);
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
            {action?.name}
            <div class="action-buttons">
                <i
                    class="action-button fas fa-cog"
                    on:click={configureAction}
                />

                <i
                    class="action-button delete-button fas fa-trash"
                    on:click={deleteAction}
                />
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
        font-size: 1rem;

        &-button {
            margin-left: auto;
            margin-right: 0.5rem;
            padding: 0.25rem;
            cursor: pointer;
            transition: all 0.15s ease-in-out;

            &:hover {
                transform: scale(1.2);
            }
        }

        &-buttons {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            color: #555;
        }

        &-list {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            padding: 0;
            margin: 0;
            list-style: none;
            font-family: "Modesto Condensed", serif;
        }
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
    }

    .tab-heading {
        font-family: "Modesto Condensed", serif;
    }
</style>
