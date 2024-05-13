<script>
    import { getContext, onDestroy, setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { localize } from "#runtime/svelte/helper";

    import prepareProficiencyConfigObject from "../../../utils/prepareProficiencyConfigObject";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import GrantConfig from "./GrantConfig.svelte";
    import Checkbox from "../Checkbox.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import ComplexDetailEmbed from "../ComplexDetailEmbed.svelte";

    export let { document, grantId, grantType } =
        getContext("#external").application;

    function updateImage() {
        const current = grant?.img;

        const filePicker = new FilePicker({
            type: "image",
            current,
            callback: (path) => {
                onUpdateValue("img", path);
            },
        });

        return filePicker.browse();
    }

    function onUpdateValue(key, value) {
        if (key === "proficiencyType") {
            updateDocumentDataFromField(
                $item,
                `system.grants.${grantId}.keys`,
                { base: [], options: [], total: 0 },
            );
        }

        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField($item, key, value);
    }

    onDestroy(() => {
        item.destroy();
    });

    const item = new TJSDocument(document);
    const configObject = prepareProficiencyConfigObject();
    const { weaponCategories, toolCategories } = CONFIG.A5E;

    $: grant = $item.system.grants[grantId];
    $: proficiencyType = grant?.proficiencyType || "armor";

    setContext("item", item);
    setContext("grantId", grantId);
    setContext("grantType", grantType);
</script>

<form>
    <header class="sheet-header">
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img
            class="grant-image"
            src={grant.img || $item.img || "icons/svg/upgrade.svg"}
            alt={grant.label}
            on:click={updateImage}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={grant.label ?? ""}
                class="grant-name"
                placeholder="Bonus Name"
                on:change={({ target }) => onUpdateValue("label", target.value)}
            />
        </div>
    </header>

    <Section
        heading="Proficiency Config"
        --a5e-section-margin="0.25rem 0"
        --a5e-section-body-gap="0.75rem"
    >
        <RadioGroup
            options={Object.entries(configObject).map(([key, { label }]) => [
                key,
                localize(label),
            ])}
            selected={proficiencyType}
            on:updateSelection={({ detail }) =>
                onUpdateValue("proficiencyType", detail)}
        />

        <!-- Keep this else it breaks when switching from tools to weapons -->
        {#key proficiencyType}
            {#if ["tool", "weapon"].includes(proficiencyType)}
                <Section heading="Base Options">
                    <ComplexDetailEmbed
                        heading="Base Options"
                        configObject={configObject[proficiencyType]?.config}
                        existingProperties={grant?.keys?.base}
                        disabledProperties={grant?.keys?.options}
                        headings={proficiencyType === "tool"
                            ? toolCategories
                            : weaponCategories}
                        on:updateSelection={({ detail }) => {
                            onUpdateValue("keys.base", detail);
                        }}
                    />
                </Section>

                <Section heading="Optional Choices">
                    <ComplexDetailEmbed
                        configObject={configObject[proficiencyType]?.config}
                        existingProperties={grant?.keys?.options}
                        disabledProperties={grant?.keys?.base}
                        headings={proficiencyType === "tool"
                            ? toolCategories
                            : weaponCategories}
                        on:updateSelection={({ detail }) => {
                            onUpdateValue("keys.options", detail);
                        }}
                    />
                </Section>
            {:else}
                <CheckboxGroup
                    heading="Base Options"
                    options={configObject[proficiencyType]?.config}
                    selected={grant?.keys?.base}
                    showToggleAllButton={true}
                    disabledOptions={grant?.keys?.options}
                    on:updateSelection={({ detail }) => {
                        onUpdateValue("keys.base", detail);
                    }}
                />

                <CheckboxGroup
                    heading="Optional Choices"
                    options={configObject[proficiencyType]?.config}
                    selected={grant?.keys?.options}
                    disabledOptions={grant?.keys?.base}
                    showToggleAllButton={true}
                    on:updateSelection={({ detail }) => {
                        onUpdateValue("keys.options", detail);
                    }}
                />
            {/if}
        {/key}

        <FieldWrapper heading="Selectable Options Count">
            <input
                type="number"
                value={grant?.keys?.total ?? 0}
                on:change={({ target }) =>
                    onUpdateValue("keys.total", Number(target.value))}
            />
        </FieldWrapper>

        {#if proficiencyType === "skill"}
            <Checkbox
                label="Grant 5e expertise in these instead of proficiency"
                checked={grant.isExpertise ?? false}
                on:updateSelection={({ detail }) =>
                    onUpdateValue("isExpertise", detail)}
            />
        {/if}
    </Section>

    <GrantConfig />
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--padding, 0.75rem);
        gap: 0.75rem;
        background: var(--background, $color-sheet-background);
        max-height: 75vh;
        overflow-y: auto;
    }

    .grant-name,
    .grant-name[type="text"] {
        font-family: $font-primary;
        font-size: $font-size-xxl;
        border: 0;
        background: transparent;
        text-overflow: ellipsis;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .grant-image {
        width: 2rem;
        height: 2rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .name-wrapper {
        width: 100%;
    }

    .sheet-header {
        display: flex;
        align-items: center;
    }
</style>
