<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import ActionConfigDialog from "../../dialogs/initializers/ActionConfigDialog";

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

    function duplicateAction(event) {
        const actions = $item.system.actions;
        const { actionId } = event.target.closest(".action").dataset;

        const newAction = foundry.utils.duplicate(actions[actionId]);
        newAction.name = `${newAction.name} (Copy)`;

        $item.update({
            "system.actions": {
                ...actions,
                [foundry.utils.randomID()]: newAction,
            },
        });
    }

    function configureAction(event) {
        const { actionId } = event.target.closest(".action").dataset;
        const actionName = $item.system.actions[actionId].name;

        const dialog = new ActionConfigDialog(item, actionId, actionName);

        dialog.render(true);
    }

    function deleteAction(event) {
        const { actionId } = event.target.closest(".action").dataset;

        $item.update({
            "system.actions": {
                [`-=${actionId}`]: null,
            },
        });
    }
</script>

<section class="action-config action-config__wrapper">
    <header class="action-config__section-header">
        <h2 class="tab-heading">
            {localize("A5E.TabActions")}
        </h2>

        <button class="add-button" on:click={addAction}>
            {localize("A5E.ButtonAddAction")}
        </button>
    </header>

    <ul class="action-list">
        {#each Object.entries($item.system.actions) as [id, action] (id)}
            <li class="action" data-action-id={id}>
                {action?.name}
                <div class="action-buttons">
                    <button
                        class="action-button fas fa-cog"
                        data-tooltip="A5E.ButtonToolTipConfigure"
                        data-tooltip-direction="UP"
                        on:click={configureAction}
                    />

                    <button
                        class="action-button fa-solid fa-clone"
                        data-tooltip="A5E.ButtonToolTipDuplicate"
                        data-tooltip-direction="UP"
                        on:click={duplicateAction}
                    />

                    <button
                        class="action-button delete-button fas fa-trash"
                        data-tooltip="A5E.ButtonToolTipDelete"
                        data-tooltip-direction="UP"
                        on:click={deleteAction}
                    />
                </div>
            </li>
        {/each}
    </ul>
</section>

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
            padding: 0.25rem;
            background: none;
            border: 0;
            transition: all 0.15s ease-in-out;
            color: #999;

            &:hover,
            &:focus {
                color: #555;
                transform: scale(1.2);
                box-shadow: none;
            }
        }

        &-buttons {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: #999;
        }

        &-list {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            padding: 0;
            margin: 0;
            list-style: none;
            font-family: "Signika", sans-serif;
        }
    }

    .delete-button:hover {
        color: #8b2525;
    }

    .tab-heading {
        font-family: "Modesto Condensed", serif;
        font-size: 1.44rem;
    }
</style>
