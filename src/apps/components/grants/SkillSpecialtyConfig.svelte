<script>
    import { getContext, onDestroy, setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import CustomTagGroup from "../CustomTagGroup.svelte";
    import GrantConfig from "./GrantConfig.svelte";
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
        if (key === "skill") {
            updateDocumentDataFromField($item, `system.grants.${grantId}.specialties`, {
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
    const { skills, skillSpecialties } = CONFIG.A5E;

    $: grant = $item.system.grants[grantId];
    $: skill = grant?.skill || "acr";
    $: specialties = skillSpecialties[skill];

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
        heading="Skill Specialty Selection"
        --a5e-section-margin="0.25rem 0"
        --a5e-section-body-direction="row"
    >
        <RadioGroup
            options={Object.entries(skills)}
            selected={skill}
            on:updateSelection={({ detail }) => {
                onUpdateValue("skill", detail);
            }}
        />
    </Section>

    <!-- Keep this else it breaks when switching from tools to weapons -->
    {#key skill}
        <CustomTagGroup
            heading="Base Options"
            options={Object.entries(specialties)}
            selected={grant?.specialties?.base}
            disabledOptions={grant?.specialties?.options}
            showToggleAllButton={true}
            on:updateSelection={({ detail }) => {
                onUpdateValue("specialties.base", detail);
            }}
        />

        <CustomTagGroup
            heading="Optional Choices"
            options={Object.entries(specialties)}
            selected={grant?.specialties?.options}
            disabledOptions={grant?.specialties?.base}
            showToggleAllButton={true}
            on:updateSelection={({ detail }) => {
                onUpdateValue("specialties.options", detail);
            }}
        />

        <FieldWrapper heading="Selectable Options Count">
            <input
                type="number"
                value={grant?.specialties?.total ?? 0}
                on:change={({ target }) =>
                    onUpdateValue("specialties.total", Number(target.value))}
            />
        </FieldWrapper>
    {/key}

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
