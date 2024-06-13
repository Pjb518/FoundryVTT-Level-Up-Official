<script lang="ts">
    import type ClassResourceManager from "../../../managers/ClassResourceManager";

    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";

    const item: any = getContext("item");

    function addResource() {
        $item.resources.add();
    }

    // const resourceTypes = {
    //     number: { heading: "Number", singleLabel: "", component: null },
    //     dice: { heading: "Dice", component: null },
    //     string: { heading: "String", component: null },
    // };

    const { resourceRecoveryOptions } = CONFIG.A5E;
    delete resourceRecoveryOptions.recharge;

    const resourceTypes = { number: "Number", dice: "Dice", string: "String" };

    $: menuList = [
        ["number", "Number"],
        ["dice", "Dice"],
        ["string", "String"],
    ];

    $: resources = [...($item.resources as ClassResourceManager)];

    $: console.log(resources);
</script>

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    {#each resources as [slug, resource]}
        <div class="a5e-class-resource">
            <input class="a5e-input" type="text" value={resource.name} />

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
                            on:change={({ target }) => {}}
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
                />
            </Section>

            <Section heading="Level Information" --a5e-section-body-gap="0.75rem">
                {#if resource.type === "number"}
                    <FieldWrapper --a5e-field-wrapper-direction="row">
                        {#each Object.entries(resource.reference) as [level, value]}
                            <input
                                class="a5e-input a5e-input--slim a5e-input--small"
                                {value}
                                type="number"
                                on:change={({ target }) => {}}
                            />
                        {/each}
                    </FieldWrapper>
                {/if}
            </Section>

            <Section heading="Recovery">
                <RadioGroup
                    options={Object.entries(resourceRecoveryOptions)}
                    selected={resource.recovery}
                    on:updateSelection={({ detail }) => {}}
                />
            </Section>
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
