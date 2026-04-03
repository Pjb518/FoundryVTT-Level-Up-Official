<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let getCurrentTab: any = getContext("interactionCurrentTab");

    let actorStore = $derived(actor.reactive.system);
    let currentTab = $derived(getCurrentTab?.());

    let showFavorPoints =
        (game.settings.get("a5e", "showFavorPoints") as boolean) ?? false;

    let favorPoints = $derived(actorStore.attributes.favorPoints);
    let projectName = $derived(actorStore.attributes.projectName);

    type FooterField = {
        label: string;
        name: string;
        value: number;
    };

    let footerFields = $derived([
        {
            label: "A5E.interactions.footers.keyKnowledge",
            name: "system.attributes.keyKnowledge",
            value: actorStore.attributes.keyKnowledge,
        },
        {
            label: "A5E.interactions.footers.religiousFavors",
            name: "system.attributes.religiousFavors",
            value: actorStore.attributes.religiousFavors,
        },
        {
            label: "A5E.interactions.footers.projectTime",
            name: "system.attributes.projectTime",
            value: actorStore.attributes.projectTime,
        },
    ]);
</script>

{#if currentTab === "downtime"}
    <div class="a5e-actor-footer__shields">
        {#each footerFields as { label, name, value }}
            <div class="a5e-details-box a5e-actor-footer__shield">
                <label for="" class="a5e-details-box__label">
                    {localize(label)}
                </label>

                <input
                    class="a5e-input a5e-input--slim a5e-details-box__input"
                    class:disable-pointer-events={!actor.isOwner}
                    type="number"
                    {name}
                    {value}
                    placeholder="0"
                    min="0"
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            actor,
                            currentTarget.name,
                            Number(currentTarget.value),
                        )}
                />
            </div>
        {/each}
    </div>

    <FieldWrapper
        heading={"A5E.interactions.footers.projectName"}
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
        --a5e-field-wrapper-gap="0.5rem"
    >
        <input
            class="a5e-input a5e-input--slim"
            class:disable-pointer-events={!actor.isOwner}
            type="text"
            name="system.attributes.projectName"
            value={projectName}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    actor,
                    currentTarget.name,
                    currentTarget.value,
                )}
        />
    </FieldWrapper>
{:else if currentTab === "journey" && showFavorPoints}
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

<style lang="scss">
    .a5e-actor-footer__shields {
        display: flex;
        gap: 0.25rem;
    }

    .a5e-actor-footer__shield {
        display: flex;
        justify-content: space-between;
    }

    .a5e-details-box__label {
        display: flex;
        height: 100%;
        align-items: center;
    }

    .a5e-details-box__input {
        border: 1px solid var(--input-border-color);
    }
</style>
