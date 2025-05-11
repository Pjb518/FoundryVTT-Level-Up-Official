<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { objectEntriesNumberKeyConverter } from "#utils/objectEntriesNumberKeyConverter.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const { maneuverDegrees, maneuverTraditions } = CONFIG.A5E;

    let editMode = $state(false);
</script>

<Section
    heading="A5E.TabManeuverProperties"
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
        <RadioGroup
            heading="A5E.ManeuverDegreePrompt"
            options={objectEntriesNumberKeyConverter(maneuverDegrees)}
            selected={parseInt(itemStore.degree, 10)}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.degree", value)}
        />

        {#if itemStore.degree > 0}
            <RadioGroup
                heading="A5E.ManeuverTraditionPrompt"
                options={Object.entries(maneuverTraditions)}
                selected={itemStore.tradition}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(
                        item,
                        "system.tradition",
                        value,
                    )}
            />

            <FieldWrapper>
                <Checkbox
                    label="A5E.ManeuverIsStance"
                    checked={itemStore.isStance}
                    onUpdateSelection={(value) => {
                        updateDocumentDataFromField(
                            item,
                            "system.isStance",
                            value,
                        );
                    }}
                />
            </FieldWrapper>

            <FieldWrapper>
                <Checkbox
                    label="A5E.SpellConcentration"
                    checked={itemStore.concentration}
                    onUpdateSelection={(value) => {
                        updateDocumentDataFromField(
                            item,
                            "system.concentration",
                            value,
                        );
                    }}
                />
            </FieldWrapper>

            <FieldWrapper heading="A5E.ItemExertionCost">
                <input
                    class="a5e-input a5e-input--slim a5e-input--small"
                    type="number"
                    name="system.exertionCost"
                    value={itemStore.exertionCost}
                    id="{item.uuid}-exertion-cost"
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.exertionCost",
                            Number(currentTarget.value),
                        )}
                />
            </FieldWrapper>
        {/if}
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.ManeuverDegreePrompt")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {localize(maneuverDegrees[itemStore.degree])}

                    {#if itemStore.degree > 0 && itemStore.isStance}
                        {localize("A5E.ManeuverStance")}
                    {/if}
                </dd>
            </div>

            {#if itemStore.degree > 0}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.ManeuverTraditionPrompt")}:
                    </dt>

                    <dd class="a5e-dl-box__content">
                        {maneuverTraditions[itemStore.tradition] ??
                            localize("A5E.None")}
                    </dd>
                </div>

                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.ItemExertionCost")}:
                    </dt>

                    <dd class="a5e-dl-box__content">
                        {itemStore.exertionCost || "0"}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</Section>
