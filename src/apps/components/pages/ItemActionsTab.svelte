<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    const item = getContext("item");

    function addAction() {
        $item.actions.add();
    }

    function duplicateAction(actionId) {
        $item.actions.duplicate(actionId);
    }

    function configureAction(actionId) {
        $item.actions.configure(actionId);
    }

    function deleteAction(actionId) {
        $item.actions.remove(actionId);
    }

    // **********************************************
    // Drag Drop Handlers
    async function _onDragStart(event, actionId) {
        const dragData = {
            actionId,
            itemUuid: $item.uuid,
            type: "Action",
        };

        return event.dataTransfer.setData(
            "text/plain",
            JSON.stringify(dragData),
        );
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

    <ul class="a5e-item-list">
        {#each Object.entries($item.system.actions ?? {}) as [id, action] (id)}
            <li
                class="a5e-item a5e-item--action"
                data-action-id={id}
                draggable="true"
                on:dragstart={(event) => _onDragStart(event, id)}
                on:auxclick={() => configureAction(id)}
            >
                <img
                    class="a5e-item__image a5e-item__image--action"
                    src={action?.img ?? $item.img ?? "icons/svg/item-bag.svg"}
                    alt=""
                />

                {action?.name}

                <div class="action-buttons">
                    <button
                        class="action-button fas fa-cog"
                        data-tooltip="A5E.ButtonToolTipConfigure"
                        data-tooltip-direction="UP"
                        on:click={() => configureAction(id)}
                    />

                    <button
                        class="action-button fa-solid fa-clone"
                        data-tooltip="A5E.ButtonToolTipDuplicate"
                        data-tooltip-direction="UP"
                        on:click={() => duplicateAction(id)}
                    />

                    <button
                        class="action-button delete-button fas fa-trash"
                        data-tooltip="A5E.ButtonToolTipDelete"
                        data-tooltip-direction="UP"
                        on:click={() => deleteAction(id)}
                    />
                </div>
            </li>
        {/each}
    </ul>
</section>

<style lang="scss">
    .action-button {
        padding: 0.25rem;
        background: none;
        border: 0;
        transition: $standard-transition;
        color: #999;

        &:hover,
        &:focus {
            color: #555;
            transform: scale(1.2);
            box-shadow: none;
        }
    }

    .action-buttons {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #999;
        margin-left: auto;
    }

    .delete-button:hover {
        color: $color-secondary;
    }

    .tab-heading {
        font-family: $font-primary;
        font-size: $font-size-xl;
    }
</style>
