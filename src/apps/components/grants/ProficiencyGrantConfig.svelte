<script>
    import { getContext, onDestroy } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";

    export let { document, grantId } = getContext("#external").application;

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
    const configObject = {
        ability: {
            label: "A5E.Ability",
            options: Object.entries(CONFIG.A5E.abilities),
        },
        skill: {
            label: "A5E.Skill",
            options: Object.entries(CONFIG.A5E.skills),
        },
    };

    $: grant = $item.system.grants[grantId];
    $: proficiencyType = grant?.proficiencyType || "ability";
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
        heading="Proficiency Type"
        --a5e-section-margin="0.25rem 0"
        --a5e-section-body-direction="row"
    >
        <FieldWrapper>
            <select
                class="u-w-fit damage-type-select"
                on:change={({ target }) =>
                    onUpdateValue("proficiencyType", target.value)}
            >
                {#each Object.entries(configObject) as [key, { label }]}
                    <option value={key} selected={proficiencyType === key}>
                        {localize(label)}
                    </option>
                {/each}
            </select>
        </FieldWrapper>
    </Section>

    <Section
        heading="Grant Config"
        --a5e-section-margin="0.25rem 0"
        --a5e-section-body-gap="0.75rem"
    >
        <CheckboxGroup
            heading="Base Options"
            options={configObject[proficiencyType]?.options}
            selected={grant?.keys?.base}
            showToggleAllButton={true}
            disabledOptions={grant?.keys?.options}
            on:updateSelection={({ detail }) => {
                onUpdateValue("keys.base", detail);
            }}
        />

        <CheckboxGroup
            heading="Optional Choices"
            options={configObject[proficiencyType]?.options}
            selected={grant?.keys?.options}
            disabledOptions={grant?.keys?.base}
            showToggleAllButton={true}
            on:updateSelection={({ detail }) => {
                onUpdateValue("keys.options", detail);
            }}
        />

        <FieldWrapper heading="Selectable Options Count">
            <input
                type="number"
                value={grant?.keys?.total ?? 0}
                on:change={({ target }) =>
                    onUpdateValue("keys.total", Number(target.value))}
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
