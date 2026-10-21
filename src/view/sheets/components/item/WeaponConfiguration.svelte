<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import getWeaponProperties from "#utils/summaries/getWeaponProperties.ts";
    import getSiegeLabel from "#utils/summaries/getSiegeLabel.ts";
    import getWeaponAugments from "#utils/summaries/getWeaponAugments.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const {
        breakerProperties,
        defensiveProperties,
        energyProperties,
        versatileOptions,
        weaponAugments,
        weaponProperties,
        actorSizes,
    } = CONFIG.A5E;

    let editMode = $state(false);
    let selectedWeaponProperties = $derived(
        getWeaponProperties(item.reactive).filter(Boolean).join(", "),
    );
    let siegeLabel = $derived(getSiegeLabel(item.reactive));
    let selectedWeaponAugments = $derived(
        getWeaponAugments(item.reactive).filter(Boolean).join(", "),
    );
</script>

<Section
    heading="A5E.tabs.weaponProperties"
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
        <CheckboxGroup
            heading="A5E.weapons.headings.properties"
            options={Object.entries(weaponProperties)}
            selected={itemStore.weaponProperties}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.weaponProperties", value)}
        />

        <CheckboxGroup
            heading="A5E.weapons.headings.augments"
            options={Object.entries(weaponAugments)}
            selected={itemStore.weaponAugments}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.weaponAugments", value)}
        />

        {#if itemStore.weaponProperties.includes("siege")}
            <FieldWrapper
                heading="A5E.weapons.siege.heading"
                --a5e-field-wrapper-gap="0.375rem 1rem"
                --a5e-field-wrapper-direction="row"
                --a5e-field-wrapper-header-width="100%"
            >
                <select
                    class="a5e-input a5e-input--slim a5e-input--fit"
                    data-tooltip="A5E.weapons.siege.size"
                    data-tooltip-direction="UP"
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.siege.size",
                            currentTarget.value,
                        )}
                >
                    {#each Object.entries(actorSizes) as [id, label]}
                        <option value={id} selected={id === itemStore.siege.size}>
                            {localize(label)}
                        </option>
                    {/each}
                </select>

                {#each [["ac", "A5E.weapons.siege.ac"], ["hp", "A5E.weapons.siege.hp"]] as [key, label]}
                    <label class="a5e-weapon-siege__field">
                        {localize(label)}

                        <input
                            class="a5e-input a5e-input--slim a5e-input--small"
                            type="number"
                            min="0"
                            value={itemStore.siege[key]}
                            onchange={({ currentTarget }) =>
                                updateDocumentDataFromField(
                                    item,
                                    `system.siege.${key}`,
                                    Number(currentTarget.value),
                                )}
                        />
                    </label>
                {/each}
            </FieldWrapper>
        {/if}

        {#if itemStore.weaponProperties.includes("breaker")}
            <CheckboxGroup
                heading="Breaker Property"
                options={Object.entries(breakerProperties)}
                selected={itemStore.breakerProperties}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(item, "system.breakerProperties", value)}
            />
        {/if}

        {#if itemStore.weaponProperties.includes("defensive")}
            <RadioGroup
                heading="Defensive Property"
                options={Object.entries(defensiveProperties)}
                selected={itemStore.defensiveProperties}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(
                        item,
                        "system.defensiveProperties",
                        value,
                    )}
            />
        {/if}

        {#if itemStore.weaponAugments.includes("energy")}
            <RadioGroup
                heading="Energy Property"
                options={Object.entries(energyProperties)}
                selected={itemStore.energyProperties}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(item, "system.energyProperties", value)}
            />
        {/if}

        {#if itemStore.weaponProperties.includes("mounted")}
            <CheckboxGroup
                heading="Mounted Property"
                options={Object.entries(versatileOptions)}
                selected={itemStore.mounted}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(item, "system.mounted", value)}
            />
        {/if}

        {#if itemStore.weaponProperties.includes("versatile")}
            <RadioGroup
                heading="Versatile Property"
                options={Object.entries(versatileOptions)}
                selected={itemStore.versatile}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(item, "system.versatile", value)}
            />
        {/if}
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.weapons.headings.properties")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {selectedWeaponProperties || localize("A5E.None")}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.weapons.headings.augments")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {selectedWeaponAugments || localize("A5E.None")}
                </dd>
            </div>

            {#if siegeLabel}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.weapons.siege.heading")}:
                    </dt>

                    <dd class="a5e-dl-box__content">{siegeLabel}</dd>
                </div>
            {/if}
        </dl>
    {/if}
</Section>

<style lang="scss">
    .a5e-weapon-siege__field {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: var(--a5e-sm-text);
    }
</style>
