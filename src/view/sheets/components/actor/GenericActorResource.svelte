<script>
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { GenericConfigDialog } from "#view/dialogs/initializers/GenericConfigDialog.svelte.ts";

    import { getDeterministicBonus } from "../../../../dice/getDeterministicBonus.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import GenericActorResourceConfigDialog from "#view/dialogs/actor/GenericActorResourceConfigDialog.svelte";

    let { resource, source } = $props();

    const actor = getContext("actor");
    const genericResources = ["primary", "secondary", "tertiary", "quaternary"];

    function configureResource() {
        let dialog = actor.dialogs.genericResources[source];

        if (!dialog) {
            actor.dialogs.genericResources[source] = new GenericConfigDialog(
                actor,
                `${actor.name}: Generic Resource Dialog`,
                GenericActorResourceConfigDialog,
                { source },
            );

            dialog = actor.dialogs.genericResources[source];
        }

        dialog.render(true);
    }

    function incrementResource() {
        resource.value = Math.max(resource.value + 1, 0);
        updateDocumentDataFromField(
            actor,
            `system.resources.${source}.value`,
            Number(resource.value),
        );
    }

    function decrementResource() {
        resource.value = Math.max(resource.value - 1, 0);
        updateDocumentDataFromField(
            actor,
            `system.resources.${source}.value`,
            Number(resource.value),
        );
    }

    function updateResourceValue(value) {
        if (isClassResource) {
            updateDocumentDataFromField(
                actor,
                `system.resources.classResources.${source}`,
                Number(value),
            );
        } else {
            updateDocumentDataFromField(
                actor,
                `system.resources.${source}.value`,
                Number(value),
            );
        }
    }

    function determineResourceVisibility(sheetIsLocked) {
        // Add class resources when sheet is locked
        if (!sheetIsLocked && !isClassResource) return true;

        // Add resource is Hide Max is set
        if (sheetIsLocked && resource.hideMax) return true;

        // Add resource is max is not 0
        if (sheetIsLocked && max !== 0) return true;

        return false;
    }

    function canRecharge(sheetIsLocked) {
        if (!sheetIsLocked) return false;
        if (resource.per !== "recharge") return false;
        if (resource.hideMax) return true;

        // Return false if the resource has a max value and the current value equals the max value
        return resource.value < max;
    }

    let isClassResource = $derived(!genericResources.includes(source));
    let max = $derived(getDeterministicBonus(resource.max, actor.getRollData()));
    let sheetIsLocked = $derived(
        !actor.isOwner ? true : (actor.reactive.flags?.a5e?.sheetIsLocked ?? true),
    );
    let showRechargeButton = $derived(canRecharge(sheetIsLocked));
    let showResource = $derived(determineResourceVisibility(sheetIsLocked));
</script>

{#if showResource}
    <li class="a5e-resource">
        <header class="a5e-resource__header">
            <input
                type="text"
                name="system.resources.{source}.label"
                value={resource.label}
                class="a5e-input a5e-input--slim a5e-resource__label"
                placeholder={localize(
                    `A5E.consumers.resources.titlePlural${source.capitalize()}`,
                )}
                disabled={sheetIsLocked}
                onchange={({ target }) =>
                    updateDocumentDataFromField(actor, target.name, target.value)}
            />

            {#if !sheetIsLocked && !isClassResource}
                <button class="a5e-resource__setting" onclick={configureResource}>
                    aria-label="???"
                    <i class="icon fas fa-gear"></i>
                </button>
            {/if}

            {#if showRechargeButton}
                <button
                    class="a5e-resource__setting"
                    data-tooltip="Recharge Resource"
                    data-tooltip-direction="UP"
                    aria-label="???"
                    onclick={() => actor.rechargeGenericResource(source)}
                >
                    <i class="icon fas fa-dice"></i>
                </button>
            {/if}
        </header>

        <div class="a5e-resource__value-container">
            {#if resource.hideMax}
                <button
                    class="a5e-button a5e-resource__btn icon fas fa-minus"
                    type="button"
                    aria-label="???"
                    disabled={resource.value === 0}
                    onclick={decrementResource}
                >
                </button>
            {/if}

            <input
                class="a5e-resource__number-input"
                class:a5e-resource__number-input--disabled={!actor.isOwner}
                type="number"
                value={resource.value}
                placeholder="0"
                min="0"
                onchange={({ target }) => updateResourceValue(target.value)}
            />

            {#if resource.hideMax}
                <button
                    class="a5e-button a5e-resource__btn icon fas fa-plus"
                    type="button"
                    aria-label="???"
                    onclick={incrementResource}
                >
                </button>
            {:else}
                <span class="a5e-resource__seperator"> / </span>

                <input
                    type="number"
                    name="system.resources.{source}.max"
                    value={getDeterministicBonus(resource.max ?? 0, actor.getRollData())}
                    class="a5e-resource__number-input"
                    placeholder="0"
                    disabled
                />
            {/if}
        </div>
    </li>
{/if}
