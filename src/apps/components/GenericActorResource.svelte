<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getDeterministicBonus from "../../dice/getDeterministicBonus";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

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

    function canRecharge(_, sheetIsLocked) {
        if (!sheetIsLocked) return false;
        if (resource.per !== "recharge") return false;
        if (resource.hideMax) return true;

        const max = getDeterministicBonus(resource.max, $actor.getRollData());

        // Return false if the resource has a max value and the current value equals the max value
        return resource.value < max;
    }

    $: resource = resource;

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: showRechargeButton = canRecharge($actor, sheetIsLocked);
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

        {#if !sheetIsLocked}
            <button class="resource-setting" on:click={configureResource}>
                <i class="fas fa-gear" />
            </button>
        {/if}

        {#if showRechargeButton}
            <button
                class="resource-setting"
                data-tooltip="Recharge Resource"
                data-tooltip-direction="UP"
                on:click={() => $actor.rechargeGenericResource(source)}
            >
                <i class="fas fa-dice" />
            </button>
        {/if}
    </header>

    <div class="resource-value-container">
        {#if resource.hideMax}
            <button
                class="a5e-button resource-btn fas fa-minus"
                type="button"
                disabled={resource.value === 0}
                on:click={decrementResource}
            />
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
                class="a5e-button resource-btn fas fa-plus"
                type="button"
                on:click={incrementResource}
            />
        {:else}
            <span class="resource-seperator"> / </span>

            <input
                type="number"
                name="system.resources.{source}.max"
                value={getDeterministicBonus(
                    resource.max ?? 0,
                    $actor.getRollData()
                )}
                class="a5e-input a5e-input--inline-item a5e-input--small resource-number-input"
                placeholder="0"
                disabled
            />
        {/if}
    </div>
</li>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .resource {
        position: relative;
        padding: 0.125rem 0.25rem 0.25rem 0.25rem;
        border: 1px solid #ccc;
        border-radius: 3px;
        min-width: 7rem;
    }

    .resource-header {
        display: flex;
        gap: 0.125rem;
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
        gap: 0.25rem;
    }

    .resource-number-input {
        flex-grow: 1;
        height: 1.125rem;
    }

    .resource-setting {
        padding: 0;
        margin: 0;
        height: 27px;
        width: fit-content;
        background: transparent;
        color: #7e7960;
        cursor: pointer;

        &:hover {
            box-shadow: none;
            color: #555;
        }

        i {
            height: 27px;
            transition: all 0.15s ease-in-out;

            &:hover {
                transform: scale(1.2);
            }
        }
    }

    .resource-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.125rem;
        height: 1.125rem;
        padding: 0;
        font-size: 0.833rem;
        color: #555;
        background-color: rgba(0 0 0 / 0.1);
    }
</style>
