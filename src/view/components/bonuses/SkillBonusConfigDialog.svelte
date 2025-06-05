<script lang="ts">
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        document: any;
        bonusID: string;
        jsonValue?: JSON;
        onchange?: (value: string) => void;
    };

    function updateImage() {
        const current = skillBonus?.img;

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
        if (jsonValue === undefined) {
            key = `system.bonuses.skills.${bonusID}.${key}`;
            updateDocumentDataFromField(actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...skillBonus,
            [key]: value,
        });

        onchange?.(JSON.stringify(newObj));
    }

    function getSKillBonus() {
        if (jsonValue === undefined)
            return actor.reactive.system.bonuses.skills[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.context = obj.context ?? {
                skills: [],
                requiresProficiency: false,
                passiveOnly: false,
            };
            obj.default = obj.default ?? true;
            obj.img = obj.img || "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                damageType: "",
                context: {
                    skills: [],
                    requiresProficiency: false,
                    passiveOnly: false,
                },
                default: true,
                img: "icons/svg/upgrade.svg",
            };
        }
    }

    let {
        document,
        bonusID,
        jsonValue = undefined,
        onchange = undefined,
    }: Props = $props();

    let actor = document;

    const { skills } = CONFIG.A5E;

    let skillBonus = $derived(getSKillBonus() ?? {});
    let passiveOnly = $derived(skillBonus.context.passiveOnly ?? false);
    let skillsContext = $derived(skillBonus.context.skills ?? []);
    let requiresProficiency = $derived(
        skillBonus.context.requiresProficiency ?? false,
    );
</script>

<form class="a5e-bonus">
    <header class="a5e-bonus__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-bonus-image"
            src={skillBonus.img}
            alt={skillBonus.label}
            onclick={() => updateImage()}
        />

        <div class="a5e-bonus-name-wrapper">
            <input
                class="a5e-input a5e-bonus-name"
                type="text"
                name="name"
                value={skillBonus.label ?? ""}
                placeholder="Bonus Name"
                onchange={({ currentTarget }) =>
                    onUpdateValue("label", currentTarget.value)}
            />
        </div>
    </header>

    <Section --a5e-section-margin="0.25rem 0">
        <FieldWrapper heading="A5E.rollLabels.formula">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={skillBonus.formula ?? ""}
                onchange={({ currentTarget }) =>
                    onUpdateValue("formula", currentTarget.value)}
            />
        </FieldWrapper>
    </Section>

    <Section
        heading="Contexts"
        hint="The context determines when the ability bonus applies"
        --a5e-section-body-gap="0.75rem"
    >
        <CheckboxGroup
            heading="A5E.contexts.skills"
            options={Object.entries(skills)}
            selected={skillsContext}
            showToggleAllButton={true}
            onUpdateSelection={(value) => {
                onUpdateValue("context.skills", value);
            }}
        />

        <Checkbox
            label="A5E.contexts.requiresProficiency"
            checked={requiresProficiency}
            onUpdateSelection={(value) => {
                onUpdateValue("context.requiresProficiency", value);
            }}
        />

        <Checkbox
            label="A5E.contexts.passiveOnly"
            checked={passiveOnly}
            onUpdateSelection={(value) => {
                onUpdateValue("context.passiveOnly", value);
            }}
        />

        <FieldWrapper>
            <Checkbox
                label="Select Skill Bonus Automatically in Roll Prompt"
                checked={skillBonus.default ?? true}
                onUpdateSelection={(value) => {
                    onUpdateValue("default", value);
                }}
            />
        </FieldWrapper>
    </Section>
</form>
