<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const { A5E } = CONFIG;
    const isGM = game.user?.isGM;

    let editMode = $state(false);
    let hideBrokenAndDamaged = game.settings.get("a5e", "hideBrokenAndDamaged");
    let showVRCTechLevel = game.settings.get("a5e", "showVRCTechLevel");
    let showVRCImplants = game.settings.get("a5e", "showVRCImplants");
</script>

<Section
    heading="A5E.tabs.objectProperties"
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
            heading="A5E.objects.typePrompt"
            options={Object.entries(A5E.objectTypes)}
            selected={itemStore.objectType}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.objectType", value)}
        />

        <RadioGroup
            heading="A5E.objects.rarity"
            options={Object.entries(A5E.itemRarity)}
            selected={itemStore.rarity}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.rarity", value)}
        />

        {#if showVRCTechLevel}
            <RadioGroup
                heading="A5E.objects.technologyLevel"
                options={Object.entries(A5E.itemTechLevels)}
                selected={itemStore.techLevel}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(item, "system.techLevel", value)}
            />
        {/if}

        <Section --a5e-section-body-direction="row" --a5e-section-body-gap="0.75rem">
            <Checkbox
                label="A5E.attunement.headings.requiredPrompt"
                checked={itemStore.requiresAttunement}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(item, "system.requiresAttunement", value)}
            />

            {#if item.actor && itemStore.requiresAttunement}
                <Checkbox
                    label="A5E.AttunementPrompt"
                    checked={itemStore.attuned}
                    onUpdateSelection={(value) =>
                        updateDocumentDataFromField(item, "system.attuned", value)}
                />
            {/if}

            {#if isGM}
                <Checkbox
                    label="A5E.objects.plotItem"
                    checked={itemStore.plotItem}
                    onUpdateSelection={(value) =>
                        updateDocumentDataFromField(item, "system.plotItem", value)}
                />

                <Checkbox
                    label="A5E.objects.unidentified"
                    checked={itemStore.unidentified}
                    onUpdateSelection={(value) =>
                        updateDocumentDataFromField(item, "system.unidentified", value)}
                />
            {/if}

            {#if itemStore.objectType == "consumable"}
                <Checkbox
                    label="A5E.supply.title"
                    checked={itemStore.supply}
                    onUpdateSelection={(value) =>
                        updateDocumentDataFromField(item, "system.supply", value)}
                />
            {/if}

            {#if showVRCImplants}
                <Checkbox
                    label="A5E.objects.implant"
                    checked={itemStore.implant}
                    onUpdateSelection={(value) =>
                        updateDocumentDataFromField(item, "system.implant", value)}
                />
            {/if}
        </Section>

        {#if itemStore.requiresAttunement}
            <FieldWrapper heading="A5E.AttunementHint">
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={itemStore.attunementHint}
                    id="{item.uuid}-attunementHint"
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.attunementHint",
                            currentTarget.value,
                        )}
                />
            </FieldWrapper>
        {/if}

        <FieldWrapper
            heading="A5E.objects.weight"
            --a5e-field-wrapper-gap="0.375rem 1rem"
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-header-width="100%"
        >
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                id="{item.uuid}-weight"
                value={itemStore.weight}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        "system.weight",
                        Number(currentTarget.value),
                    )}
            />

            <span class="weight-unit">{localize("A5E.objects.weightLbs")}</span>

            <Checkbox
                label="A5E.objects.bulky"
                checked={itemStore.bulky}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(item, "system.bulky", value)}
            />
        </FieldWrapper>

        <RadioGroup
            heading="A5E.objects.equippedState"
            options={Object.entries(A5E.equippedStates)}
            selected={itemStore.equippedState}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(
                    item,
                    "system.equippedState",
                    parseInt(value, 10),
                )}
        />

        <FieldWrapper heading="A5E.ItemQuantity">
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                min="0"
                max="9999"
                id="{item.uuid}-quantity"
                value={itemStore.quantity}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        "system.quantity",
                        Number(currentTarget.value),
                    )}
            />
        </FieldWrapper>

        <FieldWrapper heading="A5E.objects.price">
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="text"
                id="{item.uuid}-price"
                value={itemStore.price}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        "system.price",
                        currentTarget.value,
                    )}
            />
        </FieldWrapper>

        <FieldWrapper heading="A5E.objects.craftingComponents">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={itemStore.craftingComponents}
                id="{item.uuid}-craftingComponents"
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        "system.craftingComponents",
                        currentTarget.value,
                    )}
            />
        </FieldWrapper>

        {#if !hideBrokenAndDamaged}
            <RadioGroup
                heading="A5E.objects.condition"
                options={Object.entries(A5E.damagedStates)}
                selected={itemStore.damagedState}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(
                        item,
                        "system.damagedState",
                        parseInt(value, 10),
                    )}
            />
        {/if}
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.objects.typePrompt")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {A5E.objectTypes[itemStore.objectType] ?? localize("A5E.None")}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.objects.rarity")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {A5E.itemRarity[itemStore.rarity] ?? itemStore.rarity}
                </dd>
            </div>

            {#if showVRCTechLevel}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.objects.technologyLevel")}:
                    </dt>

                    <dd class="a5e-dl-box__content">
                        {A5E.itemTechLevels[itemStore.techLevel] ?? itemStore.techLevel}
                    </dd>
                </div>
            {/if}

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.attunement.headings.attunement")}
                </dt>

                <dd class="a5e-dl-box__content">
                    {#if itemStore.requiresAttunement}
                        {localize("A5E.AttunementRequired")}: ({localize(
                            itemStore.attuned ? "A5E.Attuned" : "A5E.AttunedNot",
                        )})
                    {:else}
                        {localize("A5E.attunement.headings.notRequired")}
                    {/if}
                </dd>
            </div>

            {#if itemStore.attunementHint !== ""}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.AttunementHint")}:
                    </dt>

                    <dd class="a5e-dl-box__content">
                        {itemStore.attunementHint}
                    </dd>
                </div>
            {/if}

            <hr class="a5e-rule" />

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.objects.weight")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {itemStore.weight}
                    {localize("A5E.objects.weightLbs")}

                    {#if itemStore.bulky}
                        <span class="a5e-dl-box__content--bulky">
                            {localize("A5E.objects.bulky")}
                        </span>
                    {/if}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.ItemQuantity")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {itemStore.quantity || 0}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.objects.price")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {itemStore.price || localize("A5E.None")}
                </dd>
            </div>

            {#if itemStore.craftingComponents !== ""}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.objects.craftingComponents")}:
                    </dt>

                    <dd class="a5e-dl-box__content">
                        {itemStore.craftingComponents ?? localize("A5E.None")}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</Section>

<style lang="scss">
    .weight-unit {
        font-size: var(--a5e-sm-text);
        display: flex;
        align-items: center;
    }
</style>
