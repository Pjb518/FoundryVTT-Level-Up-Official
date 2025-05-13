<script lang="ts">
    import { getContext } from "svelte";

    import Section from "#view/snippets/Section.svelte";

    function _onDragStart(e: DragEvent, actionId: string) {}

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    let actionManager = $derived(item.reactive.actions);

    let defaultAction = $derived(actionManager.default?.id);
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <Section
        heading="A5E.TabActions"
        headerButtons={[
            {
                classes: "add-button",
                handler: () => item.actions.add(),
                label: "A5E.ButtonAddAction",
            },
        ]}
        --a5e-section-gap="0.125rem"
    >
        <ul class="a5e-item-list">
            {#each Object.entries(itemStore.actions ?? {}) as [id, action] (id)}
                <li
                    class="a5e-item a5e-item--action"
                    data-action-id={id}
                    draggable="true"
                    ondragstart={(e) => _onDragStart(e, id)}
                    onauxclick={() => item.actions.configure(id)}
                >
                    <img
                        class="a5e-item__image a5e-item__image--action"
                        src={action?.img ??
                            $item.img ??
                            "icons/svg/item-bag.svg"}
                        alt=""
                    />

                    {action?.name || "New Action"}

                    <div class="a5e-button--action-wrapper">
                        <button
                            class="a5e-button--action icon fas fa-shield"
                            class:default={id === defaultAction}
                            data-tooltip="Set Default"
                            data-tooltip-direction="UP"
                            aria-label="Set Default"
                            onclick={() => item.actions.setDefaultAction(id)}
                        ></button>

                        <button
                            class="a5e-button--action icon fas fa-cog"
                            data-tooltip="A5E.ButtonToolTipConfigure"
                            data-tooltip-direction="UP"
                            aria-label="Configure"
                            onclick={() => item.actions.configure(id)}
                        ></button>

                        <button
                            class="a5e-button--action icon fa-solid fa-clone"
                            data-tooltip="A5E.ButtonToolTipDuplicate"
                            data-tooltip-direction="UP"
                            aria-label="Duplicate"
                            onclick={() => item.actions.duplicate(id)}
                        ></button>

                        <button
                            class="a5e-button--action icon delete-button fas fa-trash"
                            data-tooltip="A5E.ButtonToolTipDelete"
                            data-tooltip-direction="UP"
                            aria-label="Delete"
                            onclick={() => item.actions.remove(id)}
                        ></button>
                    </div>
                </li>
            {/each}
        </ul>
    </Section>
</section>

<style lang="scss">
    .default {
        color: var(--a5e-button-primary);

        &:hover,
        &:focus {
            color: var(--a5e-button-primary);
        }
    }

    .delete-button:hover {
        color: var(--a5e-color-error);
    }
</style>
