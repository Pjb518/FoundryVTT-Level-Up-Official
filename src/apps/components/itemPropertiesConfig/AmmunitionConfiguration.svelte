<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import Section from "../Section.svelte";

    function prepareAmmunitionProperties(item) {
        const properties = item.system.ammunitionProperties.map(
            (property) => ammunitionProperties[property] ?? property,
        );

        properties.sort((a, b) => a.localeCompare(b));

        return properties.join(", ");
    }

    const item = getContext("item");
    const ammunitionProperties = CONFIG.A5E.ammunitionProperties;

    let editMode = false;

    $: selectedAmmunitionProperties = prepareAmmunitionProperties($item);
</script>

<Section
    heading="Ammunition Configuration"
    headerButtons={[
        {
            classes: `fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-padding="0 0.125rem"
    --a5e-section-margin="0"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <CheckboxGroup
            heading="A5E.AmmunitionProperties"
            options={Object.entries(ammunitionProperties)}
            selected={$item.system.ammunitionProperties}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.ammunitionProperties",
                    event.detail,
                )}
        />
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.AmmunitionProperties")}:
                </dt>

                <dd class="u-m-0 u-p-0">
                    {selectedAmmunitionProperties || localize("A5E.None")}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
