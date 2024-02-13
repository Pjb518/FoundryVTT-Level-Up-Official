<script>
    import { getContext, onDestroy, setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import DropArea from "../dropAreas/DropArea.svelte";
    import DropTag from "../DropTag.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

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
        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField($item, key, value);
    }

    function onDropUpdate(key, value) {
        console.log(key, value);
        if (key === "features.base") {
            if (baseUuids.includes(value)) return;
            onUpdateValue(key, [...baseUuids, value]);
        }

        if (key === "features.options") {
            if (optionalUuids.includes(value)) return;
            onUpdateValue(key, [...optionalUuids, value]);
        }
    }

    onDestroy(() => {
        item.destroy();
    });

    const item = new TJSDocument(document);

    $: grant = $item.system.grants[grantId];
    $: baseUuids = grant.features.base ?? [];
    $: optionalUuids = grant.features.options ?? [];

    setContext("item", item);
    setContext("grantId", grantId);
    setContext("grantType", grantType);
</script>

<form>
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <header class="sheet-header">
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

    <Section heading="Base Features" --a5e-section-margin="0.25rem 0">
        <DropArea
            type="uuid"
            documentType="Item"
            on:document-dropped={({ detail }) =>
                onDropUpdate("features.base", detail.uuid)}
        />

        <DropTag
            uuids={baseUuids}
            on:updateSelection={({ detail }) =>
                onUpdateValue("features.base", detail)}
        />
    </Section>

    <Section heading="Optional Features" --a5e-section-margin="0.25rem 0">
        <DropArea
            type="uuid"
            documentType="Item"
            on:document-dropped={({ detail }) =>
                onDropUpdate("features.options", detail.uuid)}
        />

        <DropTag
            uuids={optionalUuids}
            on:updateSelection={({ detail }) =>
                onUpdateValue("features.options", detail)}
        />
    </Section>

    <Section heading="Grant Config" --a5e-section-body-gap="0.75rem">
        <FieldWrapper heading="Selectable Options Count">
            <input
                type="number"
                value={grant.features.total ?? 0}
                on:change={({ target }) =>
                    onUpdateValue("features.total", Number(target.value))}
            />
        </FieldWrapper>

        <Checkbox
            label="Mark grant as optional"
            checked={grant.optional ?? false}
            on:updateSelection={({ detail }) =>
                onUpdateValue("optional", detail)}
        />
    </Section>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--padding, 0.75rem);
        gap: 0.75rem;
        background: var(--background, $color-sheet-background);
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
