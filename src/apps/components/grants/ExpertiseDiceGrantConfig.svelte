<script>
    import { getContext, onDestroy, setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { localize } from "#runtime/util/i18n";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import GrantConfig from "./GrantConfig.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import prepareExpertiseDiceOptions from "../../dataPreparationHelpers/prepareExpertiseDiceOptions";

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
        if (key === "expertiseType") {
            updateDocumentDataFromField($item, `system.grants.${grantId}.keys`, {
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
    const configObject = {
        abilityCheck: {
            label: "A5E.AbilityCheck",
            options: Object.entries(CONFIG.A5E.abilities),
        },
        abilitySave: {
            label: "A5E.SavingThrow",
            options: Object.entries(CONFIG.A5E.abilities),
        },
        attack: {
            label: "A5E.ActionOptionAttack",
            options: Object.entries(CONFIG.A5E.attackTypes),
        },
        initiative: {
            label: "A5E.Initiative",
            options: [],
        },
        skill: {
            label: "A5E.Skill",
            options: Object.entries(CONFIG.A5E.skills),
        },
    };

    const expertiseDiceOptions = prepareExpertiseDiceOptions();

    $: grant = $item.system.grants[grantId];
    $: expertiseType = grant?.expertiseType || "abilityCheck";

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

    <Section heading="Expertise Configuration" --a5e-section-body-gap="0.75rem">
        <RadioGroup
            heading="Expertise Type"
            options={Object.entries(configObject).map(([key, { label }]) => [key, label])}
            selected={expertiseType}
            on:updateSelection={({ detail }) => {
                onUpdateValue("expertiseType", detail);
            }}
        />

        {#if configObject[expertiseType]?.options?.length}
            <CheckboxGroup
                heading="Base Options"
                options={configObject[expertiseType]?.options}
                selected={grant?.keys?.base}
                showToggleAllButton={true}
                disabledOptions={grant?.keys?.options}
                on:updateSelection={({ detail }) => {
                    onUpdateValue("keys.base", detail);
                }}
            />

            <CheckboxGroup
                heading="Optional Choices"
                options={configObject[expertiseType]?.options}
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
        {/if}

        <RadioGroup
            heading="Expertise Die Size"
            options={expertiseDiceOptions}
            selected={grant?.expertiseCount ?? 1}
            on:updateSelection={({ detail }) => {
                onUpdateValue("expertiseCount", detail);
            }}
        />
    </Section>

    <GrantConfig></GrantConfig>
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
