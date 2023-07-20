<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    function prepareArmorProperties(item) {
        const properties = item.system.armorProperties.map(
            (property) => armorProperties[property] ?? property
        );

        properties.sort((a, b) => a.localeCompare(b));

        return properties.join(", ");
    }

    const item = getContext("item");
    const { armor: armorTypes, armorProperties } = CONFIG.A5E;

    let editMode = false;

    $: selectedArmorProperties = prepareArmorProperties($item);
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
        <h3>{localize("Armor Configuration")}</h3>

        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.ArmorCategory">
                <RadioGroup
                    options={Object.entries(armorTypes)}
                    selected={$item.system.armorCategory}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.armorCategory",
                            event.detail
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.ArmorProperties">
                <CheckboxGroup
                    options={Object.entries(armorProperties)}
                    selected={$item.system.armorProperties}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.armorProperties",
                            event.detail
                        )}
                />
            </FormSection>
        </div>
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
</section>
