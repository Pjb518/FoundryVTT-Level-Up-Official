<script lang="ts">
    import type ClassResourceManager from "#managers/ClassResourceManager.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    function addResource() {
        item.resources.add();
    }

    function updateResource(idx: number, key: string, value: string) {
        const resources: any[] = item.system.resources.map((r: any) =>
            foundry.utils.deepClone(r),
        );

        const resource = resources.at(idx);
        if (!resource) return;

        resource[key] = value;

        if (key.includes("reference.")) {
            const [, parsedLevel] = key.split(".");
            const level = parseInt(parsedLevel, 10);

            Object.keys(resource.reference ?? {}).forEach((l) => {
                if (parseInt(l, 10) >= level) resource.reference[l] = value;
            });
        }

        resources[idx] = resource;

        updateDocumentDataFromField(item, "system.resources", resources);
    }

    const item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);

    const recoveryOptions = foundry.utils.deepClone(
        CONFIG.A5E.resourceRecoveryOptions,
    );
    delete recoveryOptions.recharge;

    let resources = $derived([
        ...(item.reactive.resources as ClassResourceManager),
    ]);
</script>

<div class="a5e-sticky-page">
    <div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
        {#each resources as [slug, resource], idx}
            <div class="a5e-class-resource">
                <input
                    class="a5e-input a5e-class-resource-name"
                    type="text"
                    placeholder="New Resource"
                    value={resource.name}
                    onchange={({ currentTarget }) => {
                        updateResource(idx, "name", currentTarget?.value);
                    }}
                />

                <button
                    class="a5e-class-resource-delete-button"
                    aria-label="Delete Resource"
                    onclick={() => item.resources.remove(slug)}
                >
                    <i class="icon fas fa-trash"></i>
                </button>

                <Section heading="Metadata" --a5e-section-body-gap="0.75rem">
                    <FieldWrapper
                        heading="Resource Identifier"
                        --a5e-field-wrapper-header-item-justification="flex-start"
                        --a5e-field-wrapper-header-gap="0.5rem"
                    >
                        <div style="display: flex; gap:0.5rem">
                            <input
                                class="a5e-input a5e-input--slim slug-input"
                                value={slug || ""}
                                type="text"
                                onchange={({ currentTarget }) => {
                                    updateResource(
                                        idx,
                                        "slug",
                                        currentTarget?.value,
                                    );
                                }}
                            />

                            <button
                                class="slug-reset-button"
                                aria-label="Reset Identifier"
                                onclick={() => null}
                            >
                                <i class="icon fas fa-solid fa-rotate-left"></i>
                            </button>
                        </div>
                    </FieldWrapper>
                </Section>

                <Section
                    heading="Level Information"
                    --a5e-section-body-gap="0.75rem"
                >
                    <div class="a5e-class-resource-reference-container">
                        {#each Object.entries(resource.reference) as [level, value]}
                            <FieldWrapper
                                heading="Level {level}"
                                --a5e-field-wrapper-margin="auto"
                                --a5e-field-wrapper-header-item-justification="center"
                            >
                                <input
                                    class="a5e-input a5e-input--slim"
                                    {value}
                                    type="text"
                                    onchange={({ currentTarget }) => {
                                        updateResource(
                                            idx,
                                            `reference.${level}`,
                                            currentTarget.value,
                                        );
                                    }}
                                />
                            </FieldWrapper>
                        {/each}
                    </div>
                </Section>

                <Section
                    heading="Consumable Data"
                    --a5e-section-body-gap="0.75rem"
                >
                    <FieldWrapper>
                        <Checkbox
                            checked={resource.consumable}
                            label="Resource is consumable"
                            onUpdateSelection={(detail) =>
                                updateResource(idx, "consumable", detail)}
                        />
                    </FieldWrapper>

                    <FieldWrapper>
                        <Checkbox
                            checked={resource.displayOnCore}
                            label="Show on Core Page"
                            onUpdateSelection={(detail) =>
                                updateResource(idx, "displayOnCore", detail)}
                        />
                    </FieldWrapper>

                    <RadioGroup
                        heading="Recovery"
                        options={Object.entries(recoveryOptions)}
                        selected={resource.recovery || ""}
                        onUpdateSelection={(detail) => {
                            updateResource(idx, "recovery", detail);
                        }}
                    />
                </Section>
            </div>
        {/each}
    </div>

    <div class="sticky-add-button">
        <button
            class="a5e-button a5e-button--transparent"
            aria-label="Add Resource"
            data-tooltip="Add Resource"
            onclick={addResource}
        >
            <i class="icon fas fa-plus"></i>
        </button>
    </div>
</div>

<style lang="scss">
    .a5e-class-resource {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0.75rem;
        position: relative;
        margin-bottom: 1rem;
        background-color: var(--a5e-background-light);

        &:not(:last-child) {
            border-bottom: 1px solid var(--a5e-border-color);
        }
    }

    .a5e-class-resource-delete-button {
        background: none;
        border: 0;
        padding: 0;
        position: absolute;
        right: 0.5rem;
        top: 0.25rem;

        width: fit-content;
        height: fit-content;
        color: rgba(0 0 0 / 0.2);
        transition: var(--a5e-transition-standard);

        &:hover,
        &:focus {
            box-shadow: none;
            transform: scale(1.2);
            color: var(--a5e-color-error);
        }
    }

    .a5e-class-resource-name {
        font-size: 1.5rem;
        border: 0;
        background: none;
        padding-left: 0;
        width: 90%;
    }

    .a5e-class-resource-reference-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        row-gap: 0.75rem;
        column-gap: 0.5rem;
        justify-content: center;
        align-items: center;
    }

    .slug-reset-button {
        background: none;
        border: 0;
        padding: 0;
        width: fit-content;
        height: fit-content;
        color: rgba(0 0 0 / 0.2);
        transition: var(--a5e-transition-standard);

        &:hover,
        &:focus {
            box-shadow: none;
            transform: scale(1.2);
            color: rgba(0 0 0 / 1);
        }
    }

    .slug-input {
        width: 95%;
    }

    .sticky-add-button {
        position: relative;
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: var(--a5e-button-gray);
    }
</style>
