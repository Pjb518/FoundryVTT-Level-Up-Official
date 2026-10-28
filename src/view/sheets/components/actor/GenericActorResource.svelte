<script lang="ts">
    import { getContext } from "svelte";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
    import GenericActorResourceConfigDialog from "#view/dialogs/actor/GenericActorResourceConfigDialog.svelte";
    import { GenericConfigDialog } from "#view/dialogs/initializers/GenericConfigDialog.svelte.ts";
    import { getDeterministicBonus } from "../../../../dice/getDeterministicBonus.ts";

    function configureResource(id: string) {
        let diag = actor.dialogs.genericResources[id];

        if (!diag) {
            diag = actor.dialogs.genericResources[id] = new GenericConfigDialog(
                actor,
                `${actor.name}: Generic Resource Dialog`,
                GenericActorResourceConfigDialog,
                { source: id },
            );
        }

        diag.render({ force: true });
    }

    const actor: Creature = getContext("actor");
    const sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let actorData = $derived(actor.reactive.system);
    let resources = $derived(actorData.resources);

    $inspect(resources);
</script>

<div class="a5e-resources-wrapper">
    {#each Object.entries(resources ?? {}) as [id, resource] (id)}
        {let slug = $derived(
            resource.slug || resource.name.slugify({ strict: true }),
        )}

        <div class="a5e-resource a5e-resource--{resource.type}">
            <span class="a5e-resource__name">
                {resource.name || "New Resource"}
            </span>

            <div class="a5e-resource__data-container">
                {#if resource.type === "counter"}
                    <!-- Counter Type -->
                    <button
                        type="button"
                        class="a5e-button a5e-button--transparent a5e-resource__button"
                        aria-label="Decrease"
                        onclick={() => {
                            updateDocumentDataFromField(
                                actor,
                                `system.resources.${slug}.value`,
                                Math.max(0, resource.value - 1),
                            );
                        }}
                    >
                        <i class="fa-solid fa-minus"></i>
                    </button>

                    <input
                        class="a5e-input a5e-resource__input"
                        type="number"
                        value={resource.value ?? 0}
                        onchange={({ currentTarget }) =>
                            updateDocumentDataFromField(
                                actor,
                                `system.resources.${slug}.value`,
                                Number.parseInt(currentTarget.value, 10),
                            )}
                    />

                    <button
                        type="button"
                        class="a5e-button a5e-button--transparent a5e-resource__button"
                        aria-label="Increase"
                        onclick={() => resource.useResource()}
                    >
                        <i class="fa-solid fa-plus"></i>
                    </button>
                {:else if resource.type === "dice"}
                    <!-- Dice Type -->
                    {#if resource.consumeType === "pool"}
                        <input
                            class="a5e-input a5e-resource__input"
                            type="number"
                            value={resource.value ?? 0}
                            onchange={({ currentTarget }) =>
                                updateDocumentDataFromField(
                                    actor,
                                    `system.resources.${slug}.value`,
                                    Number.parseInt(currentTarget.value, 10),
                                )}
                        />
                    {/if}

                    <span>{resource.size}d{resource.denom}</span>

                    <button
                        type="button"
                        class="a5e-button a5e-button--transparent a5e-resource__button"
                        aria-label="Use Resource"
                        data-tooltip="Use Resource"
                        data-tooltip-direction="UP"
                        onclick={() => resource.useResource()}
                    >
                        <i class="fa-solid fa-dice"></i>
                    </button>
                {:else if resource.type === "item"}
                    <!-- Item Type -->
                    {let item = $derived(actor.items.get(resource.itemId))}
                    {let consumeType = $derived(resource.consumeType)}
                    {#if item}
                        <input
                            class="a5e-input a5e-resource__input"
                            type="number"
                            value={consumeType === "uses"
                                ? item.system.uses.value
                                : item.system.quantity}
                            disabled={true}
                        />

                        <button
                            type="button"
                            class="a5e-button a5e-button--transparent a5e-resource__button"
                            aria-label="Use Resource"
                            data-tooltip="Use Resource"
                            data-tooltip-direction="UP"
                            onclick={() => resource.useResource()}
                        >
                            <i class="fa-solid fa-dice"></i>
                        </button>
                    {/if}
                {:else if resource.type === "uses"}
                    <!-- Uses Type -->
                    <input
                        class="a5e-input a5e-resource__input"
                        type="number"
                        value={resource.value ?? 0}
                        onchange={({ currentTarget }) =>
                            updateDocumentDataFromField(
                                actor,
                                `system.resources.${slug}.value`,
                                Number.parseInt(currentTarget.value, 10),
                            )}
                    />

                    /

                    <input
                        class="a5e-input a5e-resource__input"
                        type="number"
                        disabled={true}
                        value={getDeterministicBonus(
                            resource.max,
                            actor.getRollData(),
                        )}
                    />
                {/if}
            </div>

            {#if !sheetIsLocked()}
                <button
                    type="button"
                    class="a5e-button a5e-button--transparent a5e-resource__button"
                    aria-label="Configure"
                    data-tooltip="Configure"
                    data-tooltip-direction="UP"
                    onclick={() => configureResource(id)}
                >
                    <i class="fa-solid fa-gear"></i>
                </button>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    .a5e-resource {
        display: grid;
        grid-template-areas: "name data config";
        grid-template-columns: 1fr min-content min-content;
        gap: var(--a5e-spacing-md);
        align-items: center;
        background: var(--a5e-color-surface);
        border: var(--a5e-border-width-thin) solid
            var(--a5e-color-border-subtle);
        padding-block: var(--a5e-spacing-xs);
        padding-inline: var(--a5e-spacing-sm);

        font-size: var(--a5e-text-sm);
        font-family: var(--a5e-font-family-primary);

        &__name {
            grid-area: name;

            white-space: no-wrap;
            overflow: hidden;
            text-overflow: ellipses;
        }

        &__data-container {
            grid-area: data;

            display: flex;
            align-items: center;
            gap: var(--a5e-spacing-sm);
        }

        &__input {
            height: 1.125rem;
            width: 6ch;
            text-align: center;
        }

        &__button {
            grid-area: config;

            font-size: var(--a5e-text-xs);
        }
    }

    .a5e-resources-wrapper {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--a5e-spacing-md);

        margin-bottom: var(--a5e-spacing-lg);
    }
</style>
