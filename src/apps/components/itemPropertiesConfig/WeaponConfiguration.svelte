<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import Section from "../Section.svelte";

    function prepareWeaponProperties(item) {
        const properties = item.system.weaponProperties.map(
            (property) => weaponProperties[property] ?? property,
        );

        properties.sort((a, b) => a.localeCompare(b));

        return properties.join(", ");
    }

    const item = getContext("item");
    const { weaponProperties } = CONFIG.A5E;

    let editMode = false;

    $: selectedWeaponProperties = prepareWeaponProperties($item);
</script>

<Section
    heading="A5E.TabWeaponProperties"
    headerButtons={[
        {
            classes: `fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-margin="0"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <CheckboxGroup
            heading="A5E.WeaponProperties"
            options={Object.entries(weaponProperties)}
            selected={$item.system.weaponProperties}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.weaponProperties",
                    event.detail,
                )}
        />
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.WeaponProperties")}:</dt>

                <dd class="u-m-0 u-p-0">
                    {selectedWeaponProperties || localize("A5E.None")}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
