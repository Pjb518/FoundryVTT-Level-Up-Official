<script lang="ts">
    import type ClassResourceManager from "../../../managers/ClassResourceManager";

    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";

    const item: any = getContext("item");

    function addResource() {
        $item.resources.add();
    }

    function updateResource(idx: number, key: string, value: string | number) {
        const resources: any[] = $item.system.resources.map((r: any) => r.toObject());
        if (key === "type") {
            resources.forEach((r) => delete r.reference);
        }

        const resource = resources.at(idx);
        if (!resource) return;

        resource[key] = value;
        resources[idx] = resource;

        updateDocumentDataFromField($item, "system.resources", resources);
    }

    // @ts-ignore
    const { resourceRecoveryOptions } = CONFIG.A5E;
    delete resourceRecoveryOptions.recharge;

    const resourceTypes = { number: "Number", dice: "Dice", string: "String" };

    $: resources = [...($item.resources as ClassResourceManager)];

    $: console.log(resources);
</script>

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    {#each resources as [slug, resource], idx}
        <div class="a5e-class-resource">
            <input
                class="a5e-input"
                type="text"
                value={resource.name}
                on:change={({ target }) => {
                    // @ts-ignore
                    updateResource(idx, "name", target?.value);
                }}
            />

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
                            on:change={({ target }) => {
                                // @ts-ignore
                                updateResource(idx, "slug", target?.value);
                            }}
                        />

                        <button class="slug-reset-button" on:click={() => null}>
                            <i class="fas fa-solid fa-rotate-left" />
                        </button>
                    </div>
                </FieldWrapper>

                <RadioGroup
                    heading="Resource Type"
                    options={Object.entries(resourceTypes)}
                    selected={resource.type}
                    on:updateSelection={({ detail }) => {
                        updateResource(idx, "type", detail);
                    }}
                />
            </Section>

            <Section heading="Level Information" --a5e-section-body-gap="0.75rem">
                {#if resource.type === "number"}
                    <div
                        class="a5e-class-resource-reference-container a5e-class-resource-reference-container--number"
                    >
                        {#each Object.entries(resource.reference) as [level, value]}
                            <FieldWrapper
                                heading="Level {level}"
                                --a5e-field-wrapper-margin="auto"
                                --a5e-field-wrapper-header-item-justification="center"
                                --a5e-field-wrapper-width="min-content"
                            >
                                <input
                                    class="a5e-input a5e-input--slim a5e-input--small"
                                    {value}
                                    type="number"
                                    on:change={({ target }) => {
                                        updateResource(
                                            idx,
                                            `reference.${level}`,
                                            // @ts-ignore
                                            target.value,
                                        );
                                    }}
                                />
                            </FieldWrapper>
                        {/each}
                    </div>
                {:else if resource.type === "dice"}
                    <div class="a5e-class-resource-reference-container">
                        {#each Object.entries(resource.reference) as [level]}
                            {@const value = resource.getFormula(Number(level))}

                            <FieldWrapper
                                heading="Level {level}"
                                --a5e-field-wrapper-margin="auto"
                                --a5e-field-wrapper-header-item-justification="center"
                            >
                                <input
                                    class="a5e-input a5e-input--slim"
                                    {value}
                                    type="text"
                                    on:change={({ target }) => {
                                        updateResource(
                                            idx,
                                            `reference.${level}`,
                                            // @ts-ignore
                                            resource.convertFromString(target.value),
                                        );
                                    }}
                                />
                            </FieldWrapper>
                        {/each}
                    </div>
                {:else}
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
                                    on:change={({ target }) => {
                                        updateResource(
                                            idx,
                                            `reference.${level}`,
                                            // @ts-ignore
                                            target.value,
                                        );
                                    }}
                                />
                            </FieldWrapper>
                        {/each}
                    </div>
                {/if}
            </Section>

            {#if resource.type !== "dice"}
                <Section heading="Recovery">
                    <RadioGroup
                        options={Object.entries(resourceRecoveryOptions)}
                        selected={resource.recovery || ""}
                        on:updateSelection={({ detail }) => {
                            updateResource(idx, "recovery", detail);
                        }}
                    />
                </Section>
            {/if}
        </div>
    {/each}
</div>

<div class="sticky-add-button">
    <CreateMenu documentName="Resource" on:press={addResource} />
</div>

<style lang="scss">
    .a5e-class-resource {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
        margin-bottom: 1rem;
        background-color: #f6f2eb;
    }

    .a5e-class-resource-reference-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        row-gap: 0.75rem;
        justify-content: center;
        align-items: center;

        &--number {
            grid-template-columns: repeat(5, 1fr);
        }
    }

    .slug-reset-button {
        background: none;
        border: 0;
        padding: 0;
        width: fit-content;
        height: fit-content;
        color: rgba(0 0 0 / 0.2);
        transition: all 0.15s ease-in-out;

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
        color: #999;
    }
</style>
