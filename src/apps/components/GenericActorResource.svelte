<script>
import { getContext } from 'svelte';
import { localize } from '#runtime/util/i18n';

import GenericConfigDialog from '../dialogs/initializers/GenericConfigDialog';

import getDeterministicBonus from '../../dice/getDeterministicBonus';
import updateDocumentDataFromField from '../../utils/updateDocumentDataFromField';

import GenericActorResourceConfigDialog from '../dialogs/GenericActorResourceConfigDialog.svelte';

export let resource;
export let source;

const actor = getContext('actor');

function configureResource() {
	let dialog = $actor.dialogs.genericResources[source];

	if (!dialog) {
		$actor.dialogs.genericResources[source] = new GenericConfigDialog(
			$actor,
			`${$actor.name}: Generic Resource Dialog`,
			GenericActorResourceConfigDialog,
			{ source },
		);

		dialog = $actor.dialogs.genericResources[source];
	}

	dialog.render(true);
}

function incrementResource() {
	resource.value = Math.max(resource.value + 1, 0);
	updateDocumentDataFromField($actor, `system.resources.${source}.value`, Number(resource.value));
}

function decrementResource() {
	resource.value = Math.max(resource.value - 1, 0);
	updateDocumentDataFromField($actor, `system.resources.${source}.value`, Number(resource.value));
}

function updateResourceValue(value) {
	if (isClassResource) {
		updateDocumentDataFromField($actor, `system.resources.classResources.${source}`, Number(value));
	} else {
		updateDocumentDataFromField($actor, `system.resources.${source}.value`, Number(value));
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

function canRecharge(_, sheetIsLocked) {
	if (!sheetIsLocked) return false;
	if (resource.per !== 'recharge') return false;
	if (resource.hideMax) return true;

	// Return false if the resource has a max value and the current value equals the max value
	return resource.value < max;
}

const genericResources = ['primary', 'secondary', 'tertiary', 'quaternary'];

$: resource = resource;
$: isClassResource = !genericResources.includes(source);
$: max = getDeterministicBonus(resource.max, $actor.getRollData());
$: sheetIsLocked = !$actor.isOwner ? true : ($actor.flags?.a5e?.sheetIsLocked ?? true);
$: showRechargeButton = canRecharge($actor, sheetIsLocked);
$: showResource = determineResourceVisibility(sheetIsLocked);
</script>

{#if showResource}
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

            {#if !sheetIsLocked && !isClassResource}
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
                value={resource.value}
                placeholder="0"
                min="0"
                on:change={({ target }) => updateResourceValue(target.value)}
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
                    value={getDeterministicBonus(resource.max ?? 0, $actor.getRollData())}
                    class="a5e-input a5e-input--inline-item a5e-input--small resource-number-input"
                    placeholder="0"
                    disabled
                />
            {/if}
        </div>
    </li>
{/if}

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .resource {
        position: relative;
        padding: 0.125rem 0.25rem 0.25rem 0.25rem;
        border: 1px solid #ccc;
        border-radius: var(--a5e-border-radius-standard);
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
        color: var(--a5e-color-text-medium);
        cursor: pointer;

        &:hover {
            box-shadow: none;
            color: #555;
        }

        i {
            height: 27px;
            transition: var(--a5e-transition-standard);

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
        font-size: var(--a5e-text-size-sm);
        color: #555;
        background-color: rgba(0 0 0 / 0.1);
    }
</style>
