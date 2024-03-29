<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";

    function prepareArmorProperties(item) {
        const properties = item.system.armorProperties.map(
            (property) => armorProperties[property] ?? property,
        );

        properties.sort((a, b) => a.localeCompare(b));

        return properties.join(", ");
    }

    const item = getContext("item");
    const { armor: armorTypes, armorProperties } = CONFIG.A5E;

    let editMode = false;

    $: selectedArmorProperties = prepareArmorProperties($item);
</script>

<Section
    heading="Armor Configuration"
    headerButtons={[
        {
            classes: `fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <RadioGroup
            heading="A5E.ArmorCategory"
            options={Object.entries(armorTypes)}
            selected={$item.system.armorCategory}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.armorCategory",
                    event.detail,
                )}
        />

        <CheckboxGroup
            heading="A5E.ArmorProperties"
            options={Object.entries(armorProperties)}
            selected={$item.system.armorProperties}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.armorProperties",
                    event.detail,
                )}
        />
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ArmorCategory")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {#if $item.system.armorCategory}
                        {armorTypes[$item.system.armorCategory] ??
                            $item.system.armorCategory}
                    {:else}
                        {localize("A5E.Unknown")}
                    {/if}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ArmorProperties")}:</dt>

                <dd class="u-m-0 u-p-0">
                    {selectedArmorProperties || localize("A5E.None")}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
