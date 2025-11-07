<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import getWeaponProperties from "#utils/summaries/getWeaponProperties.ts";
    import getWeaponAugments from "#utils/summaries/getWeaponAugments.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
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
    } = CONFIG.A5E;

    let editMode = $state(false);
    let selectedWeaponProperties = $derived(
        getWeaponProperties(item.reactive).filter(Boolean).join(", "),
    );
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
        </dl>
    {/if}
</Section>
