<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import localeSort from "../../../utils/localeSort";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";

    const item = getContext("item");

    let editMode = false;

    const { shieldTypes, shieldProperties } = CONFIG.A5E;
</script>

<Section
    heading="A5E.ShieldConfiguration"
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
        <RadioGroup
            heading="A5E.ShieldCategory"
            options={Object.entries(shieldTypes)}
            selected={$item.system.shieldCategory}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.shieldCategory",
                    event.detail,
                )}
        />

        <CheckboxGroup
            heading="A5E.ShieldProperties"
            options={Object.entries(shieldProperties)}
            selected={$item.system.shieldProperties}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.shieldProperties",
                    event.detail,
                )}
        />
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

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ShieldProperties")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {#if $item.system.shieldProperties?.length}
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
                            {#each localeSort($item.system.shieldProperties) as property}
                                <li key={property}>
                                    {shieldProperties[property] ?? property}
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
</Section>
