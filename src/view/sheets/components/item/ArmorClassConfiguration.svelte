<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const { ARMOR_MODES, armorModes } = CONFIG.A5E;

    const modes = [
        ["Add", ARMOR_MODES.ADD],
        ["Override", ARMOR_MODES.OVERRIDE],
    ];

    let editMode = $state(false);
</script>

<Section
    heading="A5E.tabs.armorClassProperties"
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
        <FieldWrapper heading="A5E.armorClass.formula">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                id="{item.uuid}-ac-base-formula"
                value={itemStore.ac?.baseFormula ?? ""}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        "system.ac.baseFormula",
                        currentTarget.value,
                    )}
            />
        </FieldWrapper>

        <Section --a5e-section-body-direction="row" --a5e-section-body-padding="0">
            <FieldWrapper heading="A5E.armorClass.maxDex">
                <input
                    class="a5e-input a5e-input--slim"
                    type="number"
                    name="system.ac.maxDex"
                    id="{item.uuid}-ac-max-dex"
                    value={itemStore.ac?.maxDex ?? 0}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.ac.maxDex",
                            Number(currentTarget.value),
                        )}
                />
            </FieldWrapper>

            <FieldWrapper heading="A5E.armorClass.minStr">
                <input
                    class="a5e-input a5e-input--slim"
                    type="number"
                    id="{item.uuid}-ac-min-str"
                    value={itemStore.ac?.minStr ?? 0}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.ac.minStr",
                            Number(currentTarget.value),
                        )}
                />
            </FieldWrapper>

            <FieldWrapper heading="A5E.armorClass.mode">
                <select
                    class="a5e-input a5e-input--slim"
                    id="{item.uuid}-ac-mode"
                    value={itemStore.ac.mode}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.ac.mode",
                            Number(currentTarget.value),
                        )}
                >
                    {#each modes as [label, mode]}
                        <option value={mode}>
                            {label}
                        </option>
                    {/each}
                </select>
            </FieldWrapper>
        </Section>

        {#if itemStore.objectType === "armor"}
            <FieldWrapper>
                <Checkbox
                    label="A5E.armorClass.grantsDisadvantage"
                    checked={itemStore.ac?.grantsDisadvantage ?? false}
                    onUpdateSelection={(checked) =>
                        updateDocumentDataFromField(
                            item,
                            "system.ac.grantsDisadvantage",
                            checked,
                        )}
                />
            </FieldWrapper>
        {/if}

        {#if !["armor", "shield"].includes(itemStore?.objectType)}
            <FieldWrapper>
                <Checkbox
                    label="A5E.armorClass.requiresNoShield"
                    checked={itemStore.ac?.requiresNoShield ?? false}
                    onUpdateSelection={(value) =>
                        updateDocumentDataFromField(
                            item,
                            "system.ac.requiresNoShield",
                            value,
                        )}
                />
            </FieldWrapper>

            <FieldWrapper>
                <Checkbox
                    label="A5E.armorClass.requiresUnarmored"
                    checked={itemStore.ac?.requiresUnarmored ?? false}
                    onUpdateSelection={(value) =>
                        updateDocumentDataFromField(
                            item,
                            "system.ac.requiresUnarmored",
                            value,
                        )}
                />
            </FieldWrapper>
        {/if}
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.armorClass.formula")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {itemStore.ac?.baseFormula ?? ""}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.armorClass.maxDex")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {itemStore.ac?.maxDex ?? 0}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.armorClass.minStr")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {itemStore.ac?.minStr ?? 0}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.armorClass.mode")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {localize(armorModes[itemStore.ac?.mode])}
                </dd>
            </div>

            {#if itemStore.objectType === "armor"}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.armorClass.grantsDisadvantage")}:
                    </dt>

                    <dd class="a5e-dl-box__content">
                        {itemStore.ac?.grantsDisadvantage ? "Yes" : "No"}
                    </dd>
                </div>
            {/if}

            {#if !["armor", "shield"].includes(itemStore.objectType)}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.armorClass.requiresNoShield")}:
                    </dt>

                    <dd class="a5e-dl-box__content">
                        {itemStore.ac?.requiresNoShield ? "Yes" : "No"}
                    </dd>
                </div>

                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.armorClass.requiresUnarmored")}:
                    </dt>

                    <dd class="a5e-dl-box__content">
                        {itemStore.ac?.requiresUnarmored ? "Yes" : "No"}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</Section>
