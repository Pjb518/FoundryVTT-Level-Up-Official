<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import localeSort from "../../utils/localeSort";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    const item = getContext("item");

    let editMode = false;

    function toggleEditMode() {
        editMode = !editMode;
    }

    const { shieldTypes, shieldBaseACBonus } = CONFIG.A5E;
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
        <h3>{localize("A5E.ShieldConfiguration")}</h3>
        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.ShieldCategory">
                <RadioGroup
                    options={Object.entries(shieldTypes)}
                    selected={$item.system.shieldCategory}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.shieldCategory",
                            event.detail
                        )}
                />
            </FormSection>
        </div>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ShieldCategory")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {#if $item.system.shieldCategory}
                        {shieldTypes[$item.system.shieldCategory] ??
                            $item.system.shieldCategory}
                    {:else}
                        {localize("A5E.Unknown")}
                    {/if}
                </dd>
            </div>
        </dl>
    {/if}
</section>
