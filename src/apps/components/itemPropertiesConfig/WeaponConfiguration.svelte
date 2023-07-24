<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";

    function prepareWeaponProperties(item) {
        const properties = item.system.weaponProperties.map(
            (property) => weaponProperties[property] ?? property
        );

        properties.sort((a, b) => a.localeCompare(b));

        return properties.join(", ");
    }

    const item = getContext("item");
    const { weaponProperties } = CONFIG.A5E;

    let editMode = false;

    $: selectedWeaponProperties = prepareWeaponProperties($item);
</script>

<section>
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <header
        class="
            u-align-center
            u-flex
            u-font-serif
            u-gap-md
            u-mb-lg
            u-ml-xs
            u-pointer
            u-text-lg
            u-w-fit
        "
        on:click={() => (editMode = !editMode)}
    >
        <h3>{localize("A5E.TabWeaponProperties")}</h3>
        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.WeaponProperties">
                <CheckboxGroup
                    options={Object.entries(weaponProperties)}
                    selected={$item.system.weaponProperties}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.weaponProperties",
                            event.detail
                        )}
                />
            </FormSection>
        </div>
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
</section>
