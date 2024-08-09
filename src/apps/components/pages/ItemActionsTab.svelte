<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { ItemA5e } from "../../../documents/item/item";

    import { getContext } from "svelte";

    import Section from "../Section.svelte";

    const item: Writable<ItemA5e> = getContext("item");

    function addAction() {
        $item.actions.add();
    }

    function duplicateAction(actionId: string) {
        $item.actions.duplicate(actionId);
    }

    function configureAction(actionId: string) {
        $item.actions.configure(actionId);
    }

    function deleteAction(actionId: string) {
        $item.actions.remove(actionId);
    }

    function setDefault(actionId: string) {
        $item.actions.setDefaultAction(actionId);
    }

    // **********************************************
    // Drag Drop Handlers
    async function _onDragStart(event: DragEvent, actionId: string) {
        const dragData = {
            actionId,
            itemUuid: $item.uuid,
            type: "Action",
        };

        return event.dataTransfer?.setData("text/plain", JSON.stringify(dragData));
    }

    $: defaultAction = $item.actions.default?.id;
</script>

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <Section
        heading="A5E.TabActions"
        headerButtons={[
            {
                classes: "add-button",
                handler: addAction,
                label: "A5E.ButtonAddAction",
            },
        ]}
        --a5e-section-gap="0.125rem"
    >
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
                            class="action-button fas fa-shield"
                            class:default={id === defaultAction}
                            data-tooltip="Set Default"
                            data-tooltip-direction="UP"
                            on:click={() => setDefault(id)}
                        />

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
    </Section>
</div>

<style lang="scss">
    .action-button {
        padding: 0.25rem;
        background: none;
        border: 0;
        transition: var(--a5e-transition-standard);
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

    .default {
        color: var(--a5e-color-primary);

        &:hover,
        &:focus {
            color: var(--a5e-color-primary);
        }
    }

    .delete-button:hover {
        color: var(--a5e-color-error);
    }
</style>
