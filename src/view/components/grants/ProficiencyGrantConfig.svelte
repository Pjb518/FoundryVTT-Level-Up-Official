<script lang="ts">
    import { setContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import prepareProficiencyConfigObject from "#utils/prepareProficiencyConfigObject.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import GrantConfig from "./GrantConfig.svelte";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import Checkbox from "#view/snippets/Checkbox.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import ComplexDetailEmbed from "#view/snippets/ComplexDetailEmbed.svelte";
    import CustomTagGroup from "#view/snippets/CustomTagGroup.svelte";

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
        if (key === "proficiencyType") {
            updateDocumentDataFromField(
                $item,
                `system.grants.${grantId}.keys`,
                {
                    base: [],
                    options: [],
                    total: 0,
                },
            );
        }

        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField(item, key, value);
    }

    let { document, grantId, grantType }: Props = $props();

    const item = document;
    const configObject = prepareProficiencyConfigObject();
    const { weaponCategories, toolCategories } = CONFIG.A5E;

    let grant = $derived(item.system.grants[grantId]);
    let proficiencyType = $derived(grant?.proficiencyType || "armor");
    let options = $derived(configObject[proficiencyType]?.config ?? []);

    setContext("item", item);
    setContext("grantId", grantId);
    setContext("grantType", grantType);
</script>

<form class="a5e-grant">
    <header class="a5e-grant__header">
        <img
            class="a5e-grant-image"
            src={grant.img || $item.img || "icons/svg/upgrade.svg"}
            alt={grant.label}
            onclick={updateImage}
        />

        <div class="a5e-grant-name-wrapper">
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
            allowDeselect={false}
            onUpdateSelection={(value) =>
                onUpdateValue("proficiencyType", value)}
        />

        <!-- Keep this else it breaks when switching from tools to weapons -->
        {#key proficiencyType}
            {#if ["tool", "weapon"].includes(proficiencyType)}
                <Section heading="Base Options">
                    <ComplexDetailEmbed
                        heading="Base Options"
                        configObject={options}
                        existingProperties={grant?.keys?.base}
                        disabledProperties={grant?.keys?.options}
                        headings={proficiencyType === "tool"
                            ? toolCategories
                            : weaponCategories}
                        onUpdateSelection={(value) => {
                            onUpdateValue("keys.base", value);
                        }}
                    />
                </Section>

                <Section heading="Optional Choices">
                    <ComplexDetailEmbed
                        configObject={options}
                        existingProperties={grant?.keys?.options}
                        disabledProperties={grant?.keys?.base}
                        headings={proficiencyType === "tool"
                            ? toolCategories
                            : weaponCategories}
                        onUpdateSelection={(value) => {
                            onUpdateValue("keys.options", value);
                        }}
                    />
                </Section>
            {:else if ["skill", "savingThrow"].includes(proficiencyType)}
                <CheckboxGroup
                    heading="Base Options"
                    {options}
                    selected={grant?.keys?.base}
                    showToggleAllButton={true}
                    disabledOptions={grant?.keys?.options}
                    onUpdateSelection={(value) => {
                        onUpdateValue("keys.base", value);
                    }}
                />

                <CheckboxGroup
                    heading="Optional Choices"
                    {options}
                    selected={grant?.keys?.options}
                    disabledOptions={grant?.keys?.base}
                    showToggleAllButton={true}
                    onUpdateSelection={(value) => {
                        onUpdateValue("keys.options", value);
                    }}
                />
            {:else}
                <CustomTagGroup
                    heading="Base Options"
                    {options}
                    selected={grant?.keys?.base}
                    showToggleAllButton={true}
                    disabledOptions={grant?.keys?.options}
                    onUpdateSelection={(value) => {
                        onUpdateValue("keys.base", value);
                    }}
                />

                <CustomTagGroup
                    heading="Optional Choices"
                    {options}
                    selected={grant?.keys?.options}
                    disabledOptions={grant?.keys?.base}
                    showToggleAllButton={true}
                    onUpdateSelection={(value) => {
                        onUpdateValue("keys.options", value);
                    }}
                />
            {/if}
        {/key}

        <FieldWrapper heading="Selectable Options Count">
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={grant?.keys?.total ?? 0}
                onchange={({ currentTarget }) =>
                    onUpdateValue("keys.total", Number(currentTarget.value))}
            />
        </FieldWrapper>

        {#if proficiencyType === "skill"}
            <Checkbox
                label="Grant 5e expertise in these instead of proficiency"
                checked={grant.isExpertise ?? false}
                onUpdateSelection={(value) =>
                    onUpdateValue("isExpertise", value)}
            />
        {/if}
    </Section>

    <GrantConfig />
</form>
