<script lang="ts">
    import { getContext } from "svelte";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let actorStore = $derived(actor.reactive.system);

    let exertion = $derived(actorStore.attributes.exertion);
</script>

{#if actor.type === "character"}
    <FieldWrapper
        heading="A5E.exertion.pool"
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
        --a5e-field-wrapper-gap="0.5rem"
    >
        <input
            class="a5e-input a5e-input--small a5e-input--slim"
            class:disable-pointer-events={!actor.isOwner}
            type="number"
            name="system.attributes.exertion.current"
            value={exertion.current}
            placeholder="0"
            min="0"
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    actor,
                    currentTarget.name,
                    Number(currentTarget.value),
                )}
        />

        /

        <input
            class="a5e-input a5e-input--small a5e-input--slim"
            type="number"
            name="system.attributes.exertion.max"
            value={exertion.max}
            disabled={actor.reactive.automationAvailable}
            placeholder="0"
            min="0"
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    actor,
                    currentTarget.name,
                    Number(currentTarget.value),
                )}
        />

        {#if exertion.current < exertion.max && exertion.max}
            <button
                class="a5e-button a5e-button--transparent"
                data-tooltip="A5E.exertion.rechargeFromHitDice"
                data-tooltip-direction="UP"
                aria-label="A5E.exertion.rechargeFromHitDice"
                onclick={() => actor.recoverExertionUsingHitDice()}
            >
                <i class="icon fa-solid fa-bolt"></i>
            </button>
        {/if}
    </FieldWrapper>
{/if}
