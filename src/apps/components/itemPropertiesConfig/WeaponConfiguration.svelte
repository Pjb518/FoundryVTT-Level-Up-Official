<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import localeSort from "../../../utils/localeSort";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";

    const item = getContext("item");
    const { A5E } = CONFIG;

    let editMode = false;

    function toggleEditMode() {
        editMode = !editMode;
    }
</script>

<section>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
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
        on:click={toggleEditMode}
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
                    options={Object.entries(A5E.weaponProperties)}
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
                    {#if $item.system.weaponProperties.length}
                        <ul
                            class="
                            u-comma-list
                            u-flex
                            u-flex-shrink-0
                            u-gap-ch
                            u-list-style-none
                            u-m-0
                            u-p-0
                            u-w-fit
                        "
                        >
                            {#each localeSort($item.system.weaponProperties) as property}
                                <li key={property}>
                                    {A5E.weaponProperties[property] ?? property}
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        {localize("A5E.None")}
                    {/if}
                </dd>
            </div>
        </dl>
    {/if}
</section>
