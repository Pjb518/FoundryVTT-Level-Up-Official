<script lang="ts">
    import { setContext } from "svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import GrantConfig from "./GrantConfig.svelte";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    type Props = {
        document: any;
        grantId: string;
        grantType: string;
    };

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

    function onUpdateValue(key: string, value: any) {
        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField(item, key, value);
    }

    let { document, grantId, grantType }: Props = $props();

    let item = document;
    const { exertionPoolTypes } = CONFIG.A5E;

    let grant = $derived(item.reactive.system.grants[grantId]);
    let exertionType = $derived(grant?.exertionType);

    setContext("item", item);
    setContext("grantId", grantId);
    setContext("grantType", grantType);
</script>

<form class="a5e-grant">
    <header class="a5e-grant__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-grant-image"
            src={grant.img || item.img || "icons/svg/upgrade.svg"}
            alt={grant.label}
            onclick={updateImage}
        />

        <div class="a5e-name-wrapper">
            <input
                class="a5e-input a5e-grant-name"
                type="text"
                name="name"
                value={grant.label ?? ""}
                placeholder="Bonus Name"
                onchange={({ currentTarget }) =>
                    onUpdateValue("label", currentTarget.value)}
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
            onUpdateSelection={(value) => onUpdateValue("exertionType", value)}
        />

        {#if exertionType === "pool"}
            <RadioGroup
                heading="Exertion Pool Type"
                options={Object.entries(exertionPoolTypes)}
                selected={grant.poolType}
                allowDeselect={false}
                onUpdateSelection={(value) => onUpdateValue("poolType", value)}
            />
        {:else}
            <FieldWrapper heading="A5E.rollLabels.formula">
                <input
                    type="text"
                    value={grant.bonus ?? ""}
                    onchange={({ currentTarget }) =>
                        onUpdateValue("bonus", currentTarget.value)}
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
        background: var(--background, var(--a5e-color-background-sheet));
    }

    .grant-name,
    .grant-name[type="text"] {
        font-family: var(--a5e-font-primary);
        font-size: var(--a5e-text-size-xxl);
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
