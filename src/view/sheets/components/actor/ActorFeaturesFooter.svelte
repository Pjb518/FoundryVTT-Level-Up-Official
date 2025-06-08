<script lang="ts">
    import { getContext } from "svelte";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let actorStore = $derived(actor.reactive.system);

    let showFavorPoints =
        (game.settings.get("a5e", "showFavorPoints") as boolean) ?? false;

    let favorPoints = $derived(actorStore.attributes.favorPoints);
</script>

{#if actor.type === "character" && showFavorPoints}
    <FieldWrapper
        heading={"A5E.consumers.favorPoints"}
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
        --a5e-field-wrapper-gap="0.5rem"
    >
        <input
            class="a5e-input a5e-input--actor-footer"
            class:disable-pointer-events={!actor.isOwner}
            type="number"
            name="system.attributes.favorPoints.current"
            value={favorPoints.current}
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

        <span class="a5e-footer-group__value">
            {favorPoints.max}
        </span>
    </FieldWrapper>
{/if}
