<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    import GenericActorResourceConfigDialog from "../dialogs/initializers/GenericActorResourceConfigDialog";

    export let resource;
    export let source;

    const actor = getContext("actor");

    function configureResource() {
        const dialog = new GenericActorResourceConfigDialog(actor, source);
        dialog.render(true);
    }

    function incrementResource() {
        resource.value = Math.max(resource.value + 1, 0);
        updateDocumentDataFromField(
            $actor,
            `system.resources.${source}.value`,
            Number(resource.value)
        );
    }

    function decrementResource() {
        resource.value = Math.max(resource.value - 1, 0);
        updateDocumentDataFromField(
            $actor,
            `system.resources.${source}.value`,
            Number(resource.value)
        );
    }

    $: resource = resource;
    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li class="resource">
    <header class="resource-header">
        <input
            type="text"
            name="system.resources.{source}.label"
            value={resource.label}
            class="a5e-input a5e-input--slim resource-label"
            placeholder={localize(`A5E.Resources${source.capitalize()}`)}
            disabled={sheetIsLocked}
            on:change={({ target }) =>
                updateDocumentDataFromField($actor, target.name, target.value)}
        />
    </header>

    <div class="resource-value-container">
        {#if resource.hideMax}
            <button
                class="a5e-button resource-btn"
                type="button"
                disabled={resource.value === 0}
                on:click={decrementResource}
            >
                <i class="fas fa-minus" />
            </button>
        {/if}

        <input
            class="a5e-input a5e-input--inline-item a5e-input--small resource-number-input"
            class:disable-pointer-events={!$actor.isOwner}
            type="number"
            name="system.resources.{source}.value"
            value={resource.value}
            placeholder="0"
            min="0"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value)
                )}
        />

        {#if resource.hideMax}
            <button
                class="a5e-button resource-btn"
                type="button"
                on:click={incrementResource}
            >
                <i class="fas fa-plus" />
            </button>
        {:else}
            <span class="resource-seperator"> / </span>

            <input
                type="number"
                name="system.resources.{source}.max"
                value={resource.max}
                class="a5e-input a5e-input--inline-item a5e-input--small resource-number-input"
                placeholder="0"
                disabled={sheetIsLocked}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value)
                    )}
            />
        {/if}
    </div>

    {#if !sheetIsLocked}
        <div class="resource-setting">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <i
                class="fas fa-gear a5e-config-button"
                on:click={configureResource}
            />
        </div>
    {/if}
</li>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .resource {
        position: relative;
        padding: 0.125rem;
        border: 1px solid #ccc;
        border-radius: 3px;
        min-width: 7rem;
    }

    .resource-label {
        padding: 0;
        border: 0;
        background: transparent;
        text-align: center;
        text-overflow: ellipsis;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .resource-value-container {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
        gap: 0.25rem;
        padding-inline: 0.25rem;
    }

    .resource-number-input {
        flex-grow: 1;
    }

    .resource-setting {
        position: absolute;
        top: 0.25rem;
        right: 0.25rem;
        cursor: pointer;
    }

    .resource-btn {
        display: flex;
        padding: 0;
        justify-content: center;
        align-items: center;
        width: 1.25rem;
        height: 1.25rem;
        background-color: rgba(0 0 0 / 0.1);

        & > i {
            margin: 0;
        }
    }
</style>
