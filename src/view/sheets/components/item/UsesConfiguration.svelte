<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { getDeterministicBonus } from "../../../../dice/getDeterministicBonus.ts";
    import handleDeterministicInput from "#utils/handleDeterministicInput.ts";
    import { formulaIsClassResource } from "#utils/formulaIsClassResource.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    function prepareUsesSummary() {
        const { uses } = itemStore;

        const maxUses = item.actor
            ? getDeterministicBonus(uses?.max ?? 0, item.actor?.getRollData(item) ?? {})
            : uses?.max;

        let summary: string;

        if (uses.value && maxUses) summary = `${uses.value} / ${maxUses}`;
        else if (uses.value && !maxUses) summary = uses.value;
        else if (!uses.value && maxUses) summary = `0 / ${maxUses}`;
        else return "";

        if (uses.per === "recharge") {
            summary = `${summary} (Recharges on ${uses.recharge.threshold})`;
        } else if (uses.per) {
            summary = `${summary} (Per ${resourceRecoveryOptions[uses.per]})`;
        }

        return summary;
    }

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const { resourceRecoveryOptions } = CONFIG.A5E;

    let editMode = $state(false);
    let usesSummary = $derived(prepareUsesSummary());
    let isClassResource = $derived(formulaIsClassResource(itemStore.uses.max ?? ""));
</script>

<Section
    heading="A5E.ItemUsesConfiguration"
    headerButtons={[
        {
            classes: `icon fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <Section --a5e-section-body-direction="row" --a5e-section-body-gap="0.5rem">
            {#if !isClassResource}
                <FieldWrapper heading="A5E.consumers.uses.current">
                    <input
                        class="a5e-input a5e-input--slim"
                        type="number"
                        value={itemStore.uses.value}
                        onchange={({ currentTarget }) =>
                            updateDocumentDataFromField(
                                item,
                                "system.uses.value",
                                Number(currentTarget.value),
                            )}
                    />
                </FieldWrapper>
            {/if}

            <FieldWrapper heading="A5E.consumers.uses.max">
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={itemStore.uses.max}
                    onchange={({ currentTarget }) => {
                        handleDeterministicInput(currentTarget.value);
                        updateDocumentDataFromField(
                            item,
                            "system.uses.max",
                            currentTarget.value,
                        );
                    }}
                />
            </FieldWrapper>

            <FieldWrapper heading="A5E.consumers.uses.per">
                <select
                    class="a5e-input a5e-input--slim"
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.uses.per",
                            currentTarget.value,
                        )}
                >
                    <option value=""></option>

                    {#each Object.entries(resourceRecoveryOptions) as [key, name]}
                        <option value={key} selected={itemStore.uses.per === key}>
                            {localize(name as string)}
                        </option>
                    {/each}
                </select>
            </FieldWrapper>
        </Section>

        {#if itemStore.uses.per === "recharge"}
            <Section
                heading="A5E.actions.headings.recharge.configuration"
                --a5e-section-body-direction="row"
                --a5e-section-body-gap="0.5rem"
            >
                <FieldWrapper heading="A5E.actions.headings.recharge.formula">
                    <input
                        class="a5e-input a5e-input--slim"
                        id="{item.uuid}-recharge-formula"
                        type="text"
                        value={itemStore.uses.recharge.formula}
                        placeholder="1d6"
                        onchange={({ currentTarget }) => {
                            handleDeterministicInput(currentTarget.value);
                            updateDocumentDataFromField(
                                item,
                                `system.uses.recharge.formula`,
                                currentTarget.value,
                            );
                        }}
                    />
                </FieldWrapper>

                <FieldWrapper heading="A5E.actions.headings.recharge.threshold">
                    <input
                        id="{item.id}-recharge-threshold"
                        class="a5e-input a5e-input--slim"
                        type="number"
                        value={itemStore.uses.recharge.threshold}
                        onchange={({ currentTarget }) =>
                            updateDocumentDataFromField(
                                item,
                                `system.uses.recharge.threshold`,
                                Number(currentTarget.value),
                            )}
                    />
                </FieldWrapper>
            </Section>
        {/if}
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.consumers.uses.title")}:
                </dt>

                <dd
                    class="a5e-dl-box__content"
                    data-tooltip={itemStore.uses.per === "recharge"
                        ? itemStore.uses.recharge.formula
                        : null}
                    data-tooltip-direction="UP"
                >
                    {usesSummary || localize("A5E.None")}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
