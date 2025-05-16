<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item: any = getContext("item");
    const { A5E } = CONFIG;

    let editMode = false;
</script>

<Section
    heading="A5E.tabs.containerProperties"
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
        <RadioGroup
            heading="Capacity Type"
            options={Object.entries(A5E.capacityTypes)}
            selected={$item.system.capacity.type}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.capacity.type",
                    detail,
                )}
        />

        <FieldWrapper heading="Max Capacity">
            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="number"
                min="0"
                value={$item.system.capacity.value}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.capacity.value",
                        // @ts-ignore
                        Number(target.value),
                    )}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="Has Weightless Contents"
                checked={$item.system.capacity.weightlessContents}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.capacity.weightlessContents",
                        detail,
                    )}
            />
        </FieldWrapper>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">Capacity Type:</dt>
                <dd class="u-m-0 u-p-0">
                    {localize(A5E.capacityTypes[$item.system.capacity.type]) ??
                        localize("A5E.None")}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">Max Capacity:</dt>
                <dd class="u-m-0 u-p-0">{$item.system.capacity.value ?? 0}</dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">Has Weightless Contents:</dt>
                <dd class="u-m-0 u-p-0">
                    {$item.system.capacity.weightlessContents ? "Yes" : "No"}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
