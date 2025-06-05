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
        const current = initiativeBonus?.img;

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
            key = `system.bonuses.initiative.${bonusID}.${key}`;
            updateDocumentDataFromField(actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...initiativeBonus,
            [key]: value,
        });

        onchange?.(JSON.stringify(newObj));
    }

    function getInitBonus() {
        if (jsonValue === undefined)
            return actor.reactive.system.bonuses.initiative[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.context = obj.context ?? {
                abilities: Object.keys(CONFIG.A5E.abilities),
                skills: Object.keys(CONFIG.A5E.skills),
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
                    abilities: Object.keys(CONFIG.A5E.abilities),
                    skills: Object.keys(CONFIG.A5E.skills),
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

    const { abilities, skills } = CONFIG.A5E;

    let initiativeBonus = $derived(getInitBonus() ?? {});
    let abilitiesContext = $derived(initiativeBonus.context?.abilities ?? []);
    let skillsContext = $derived(initiativeBonus.context?.skills ?? []);
</script>

<form class="a5e-bonus">
    <header class="a5e-bonus__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-bonus-image"
            src={initiativeBonus.img}
            alt={initiativeBonus.label}
            onclick={() => updateImage()}
        />

        <div class="a5e-name-wrapper">
            <input
                class="a5e-input a5e-bonus-name"
                type="text"
                name="name"
                value={initiativeBonus.label ?? ""}
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
                value={initiativeBonus.formula ?? ""}
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
            heading="A5E.contexts.abilities"
            options={Object.entries(abilities)}
            selected={abilitiesContext}
            showToggleAllButton={true}
            onUpdateSelection={(value) => {
                onUpdateValue("context.abilities", value);
            }}
        />

        <CheckboxGroup
            heading="A5E.contexts.skills"
            options={Object.entries(skills)}
            selected={skillsContext}
            showToggleAllButton={true}
            onUpdateSelection={(value) => {
                onUpdateValue("context.skills", value);
            }}
        />

        <FieldWrapper>
            <Checkbox
                label="Select Ability Bonus Automatically in Roll Prompt"
                checked={initiativeBonus.default ?? true}
                onUpdateSelection={(value) => {
                    onUpdateValue("default", value);
                }}
            />
        </FieldWrapper>
    </Section>
</form>
