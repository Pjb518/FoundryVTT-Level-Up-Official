<script lang="ts">
    import { setContext } from "svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
    import { prepareExpertiseDiceOptions } from "#utils/view/helpers/prepareExpertiseDiceOptions.ts";

    import GrantConfig from "./GrantConfig.svelte";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
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
        if (key === "expertiseType") {
            updateDocumentDataFromField(item, `system.grants.${grantId}.keys`, {
                base: [],
                options: [],
                total: 0,
            });
        }

        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField(item, key, value);
    }

    let { document, grantId, grantType }: Props = $props();

    let item = document;
    const configObject = {
        abilityCheck: {
            label: "A5E.abilities.headings.check",
            options: Object.entries(CONFIG.A5E.abilities),
        },
        abilitySave: {
            label: "A5E.SavingThrow",
            options: Object.entries(CONFIG.A5E.abilities),
        },
        attack: {
            label: "A5E.actions.headings.options.attack",
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

    let grant = $derived(item.reactive.system.grants[grantId]);
    let expertiseType = $derived(grant?.expertiseType || "abilityCheck");

    setContext("item", item);
    setContext("grantId", grantId);
    setContext("grantType", grantType);
</script>

<form class="a5e-grant">
    <header class="a5e-grant__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="grant-image"
            src={grant.img || $item.img || "icons/svg/upgrade.svg"}
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

    <Section heading="Expertise Configuration" --a5e-section-body-gap="0.75rem">
        <RadioGroup
            heading="Expertise Type"
            options={Object.entries(configObject).map(([key, { label }]) => [
                key,
                label,
            ])}
            selected={expertiseType}
            onUpdateSelection={(value) => {
                onUpdateValue("expertiseType", value);
            }}
        />

        {#if configObject[expertiseType]?.options?.length}
            <CheckboxGroup
                heading="Base Options"
                options={configObject[expertiseType]?.options}
                selected={grant?.keys?.base}
                showToggleAllButton={true}
                disabledOptions={grant?.keys?.options}
                onUpdateSelection={(value) => {
                    onUpdateValue("keys.base", value);
                }}
            />

            <CheckboxGroup
                heading="Optional Choices"
                options={configObject[expertiseType]?.options}
                selected={grant?.keys?.options}
                disabledOptions={grant?.keys?.base}
                showToggleAllButton={true}
                onUpdateSelection={(value) => {
                    onUpdateValue("keys.options", value);
                }}
            />

            <FieldWrapper heading="Selectable Options Count">
                <input
                    type="number"
                    value={grant?.keys?.total ?? 0}
                    onchange={({ currentTarget }) =>
                        onUpdateValue(
                            "keys.total",
                            Number(currentTarget.value),
                        )}
                />
            </FieldWrapper>
        {/if}

        <RadioGroup
            heading="Expertise Die Size"
            options={expertiseDiceOptions}
            selected={grant?.expertiseCount ?? 1}
            onUpdateSelection={(value) => {
                onUpdateValue("expertiseCount", value);
            }}
        />
    </Section>

    <GrantConfig></GrantConfig>
</form>
