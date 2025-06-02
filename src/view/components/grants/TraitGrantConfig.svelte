<script lang="ts">
    import { setContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import prepareTraitGrantConfigObject from "#utils/prepareTraitGrantConfigObject.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import GrantConfig from "./GrantConfig.svelte";

    import CustomTagGroup from "#view/snippets/CustomTagGroup.svelte";
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

    function onUpdateValue(key, value) {
        if (key === "traits.traitType") {
            updateDocumentDataFromField(
                $item,
                `system.grants.${grantId}.traits`,
                {
                    base: [],
                    options: [],
                    total: 0,
                },
            );
        }

        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField($item, key, value);
    }

    let { document, grantId, grantType }: Props = $props();

    let item = document;
    const configObject = prepareTraitGrantConfigObject();

    let grant = $derived(item.reactive.system.grants[grantId]);
    let traitType = $derived(grant?.traits?.traitType || "armorTypes");
    let options = $derived(configObject[traitType]?.config ?? []);

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

    <Section heading="Trait Config" --a5e-section-body-gap="0.75rem">
        <RadioGroup
            heading="Trait Type"
            options={Object.entries(configObject).map(([key, { label }]) => [
                key,
                localize(label),
            ])}
            selected={traitType}
            allowDeselect={false}
            onUpdateSelection={(value) => {
                onUpdateValue("traits.traitType", value);
            }}
        />

        {#key traitType}
            <CustomTagGroup
                heading="Base Options"
                {options}
                selected={grant?.traits?.base}
                disabledOptions={grant?.traits?.options}
                showToggleAllButton={true}
                onUpdateSelection={(value) => {
                    onUpdateValue("traits.base", value);
                }}
            />

            <CustomTagGroup
                heading="Optional Choices"
                {options}
                selected={grant?.traits?.options}
                disabledOptions={grant?.traits?.base}
                showToggleAllButton={true}
                onUpdateSelection={(value) => {
                    onUpdateValue("traits.options", value);
                }}
            />
        {/key}

        <FieldWrapper heading="Selectable Options Count">
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={grant?.traits?.total ?? 0}
                onchange={({ currentTarget }) =>
                    onUpdateValue("traits.total", Number(currentTarget.value))}
            />
        </FieldWrapper>
    </Section>

    <GrantConfig />
</form>
