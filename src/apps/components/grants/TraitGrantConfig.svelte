<script>
    import { getContext, onDestroy, setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { localize } from "#runtime/svelte/helper";

    import prepareTraitGrantConfigObject from "../../../utils/prepareTraitGrantConfigObject";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import CustomTagGroup from "../CustomTagGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import GrantConfig from "./GrantConfig.svelte";
    import Section from "../Section.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    export let { document, grantId, grantType } = getContext("#external").application;

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
        if (key === "traits.traitType") {
            updateDocumentDataFromField($item, `system.grants.${grantId}.traits`, {
                base: [],
                options: [],
                total: 0,
            });
        }

        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField($item, key, value);
    }

    onDestroy(() => {
        item.destroy();
    });

    const item = new TJSDocument(document);
    const configObject = prepareTraitGrantConfigObject();

    $: grant = $item.system.grants[grantId];
    $: traitType = grant?.traits?.traitType || "armorTypes";
    $: options = configObject[traitType]?.config ?? [];

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

    <Section heading="Trait Config" --a5e-section-body-gap="0.75rem">
        <RadioGroup
            heading="Trait Type"
            options={Object.entries(configObject).map(([key, { label }]) => [
                key,
                localize(label),
            ])}
            selected={traitType}
            on:updateSelection={({ detail }) => {
                onUpdateValue("traits.traitType", detail);
            }}
        />

        {#key traitType}
            <CustomTagGroup
                heading="Base Options"
                {options}
                selected={grant?.traits?.base}
                disabledOptions={grant?.traits?.options}
                showToggleAllButton={true}
                on:updateSelection={({ detail }) => {
                    onUpdateValue("traits.base", detail);
                }}
            />

            <CustomTagGroup
                heading="Optional Choices"
                {options}
                selected={grant?.traits?.options}
                disabledOptions={grant?.traits?.base}
                showToggleAllButton={true}
                on:updateSelection={({ detail }) => {
                    onUpdateValue("traits.options", detail);
                }}
            />
        {/key}

        <FieldWrapper heading="Selectable Options Count">
            <input
                type="number"
                value={grant?.traits?.total ?? 0}
                on:change={({ target }) =>
                    onUpdateValue("traits.total", Number(target.value))}
            />
        </FieldWrapper>
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
