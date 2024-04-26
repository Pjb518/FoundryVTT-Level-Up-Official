<script>
    import { getContext, onDestroy, setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";
    import NumericalGrantContexts from "./NumericalGrantContexts.svelte";
    import GrantConfig from "./GrantConfig.svelte";
    import RadioGroup from "../RadioGroup.svelte";

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

    onDestroy(() => {
        item.destroy();
    });

    const item = new TJSDocument(document);
    const { exertionPoolTypes } = CONFIG.A5E;

    $: grant = $item.system.grants[grantId];
    $: exertionType = grant?.exertionType;

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

    <Section
        heading="Exertion Bonus Configuration"
        --a5e-section-body-gap="0.75rem"
    >
        <RadioGroup
            heading="Exertion Bonus Mode"
            options={[
                ["bonus", "Bonus"],
                ["pool", "Pool"],
            ]}
            selected={exertionType}
            allowDeselect={false}
            on:updateSelection={({ detail }) =>
                onUpdateValue("exertionType", detail)}
        />

        {#if exertionType === "pool"}
            <RadioGroup
                heading="Exertion Pool Type"
                options={Object.entries(exertionPoolTypes)}
                selected={grant.poolType}
                allowDeselect={false}
                on:updateSelection={({ detail }) =>
                    onUpdateValue("poolType", detail)}
            />
        {:else}
            <FieldWrapper heading="A5E.Formula">
                <input
                    type="text"
                    value={grant.bonus ?? ""}
                    on:change={({ target }) =>
                        onUpdateValue("bonus", target.value)}
                />
            </FieldWrapper>
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
