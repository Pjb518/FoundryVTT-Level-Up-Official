<script lang="ts">
    import { setContext } from "svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import GrantConfig from "./GrantConfig.svelte";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import CustomTagGroup from "#view/snippets/CustomTagGroup.svelte";
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
        if (key === "skill") {
            updateDocumentDataFromField(
                item,
                `system.grants.${grantId}.specialties`,
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

    let item = document;
    const { skills, skillSpecialties } = CONFIG.A5E;

    let grant = $derived(item.reactive.system.grants[grantId]);
    let skill = $derived(grant?.skill || "acr");
    let specialties = $derived(skillSpecialties[skill]);

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
        heading="Skill Specialty Selection"
        --a5e-section-margin="0.25rem 0"
        --a5e-section-body-direction="row"
    >
        <RadioGroup
            options={Object.entries(skills)}
            selected={skill}
            onUpdateSelection={(value) => {
                onUpdateValue("skill", value);
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
            onUpdateSelection={(value) => {
                onUpdateValue("specialties.base", value);
            }}
        />

        <CustomTagGroup
            heading="Optional Choices"
            options={Object.entries(specialties)}
            selected={grant?.specialties?.options}
            disabledOptions={grant?.specialties?.base}
            showToggleAllButton={true}
            onUpdateSelection={(value) => {
                onUpdateValue("specialties.options", value);
            }}
        />

        <FieldWrapper heading="Selectable Options Count">
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={grant?.specialties?.total ?? 0}
                onchange={({ currentTarget }) =>
                    onUpdateValue(
                        "specialties.total",
                        Number(currentTarget.value),
                    )}
            />
        </FieldWrapper>
    {/key}

    <GrantConfig />
</form>
