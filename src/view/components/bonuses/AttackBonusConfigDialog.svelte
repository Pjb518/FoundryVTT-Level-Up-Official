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
        const current = attackBonus?.img;

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
            key = `system.bonuses.attacks.${bonusID}.${key}`;
            updateDocumentDataFromField(actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...attackBonus,
            [key]: value,
        });

        onchange?.(JSON.stringify(newObj));
    }

    function getAttackBonus() {
        if (jsonValue === undefined)
            return actor.reactive.system.bonuses.attacks[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.context = obj.context ?? {
                attackTypes: [],
                spellLevels: [],
                requiresProficiency: false,
            };
            obj.default = obj.default ?? true;
            obj.img = obj.img || "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                context: {
                    attackTypes: [],
                    spellLevels: [],
                    requiresProficiency: false,
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

    const { attackTypes, spellLevels } = CONFIG.A5E;

    let attackBonus = $derived(getAttackBonus() ?? {});
    let attackTypesContext = $derived(attackBonus.context.attackTypes ?? []);
    let spellLevelsContext = $derived(attackBonus.context.spellLevels ?? []);
    let requiresProficiency = $derived(attackBonus.context.requiresProficiency ?? false);
</script>

<form class="a5e-bonus">
    <header class="a5e-bonus__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-bonus-image"
            src={attackBonus.img}
            alt={attackBonus.label}
            onclick={() => updateImage()}
        />

        <div class="a5e-bonus-name-wrapper">
            <input
                class="a5e-input a5e-bonus-name"
                type="text"
                name="name"
                value={attackBonus.label ?? ""}
                placeholder="Bonus Name"
                onchange={({ currentTarget }) =>
                    onUpdateValue("label", currentTarget.value)}
            />
        </div>
    </header>

    <Section --a5e-section-body-direction="row" --a5e-section-margin="0.25rem 0">
        <FieldWrapper heading="A5E.rollLabels.formula" --a5e-field-wrapper-grow="1">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={attackBonus.formula ?? ""}
                onchange={({ currentTarget }) =>
                    onUpdateValue("formula", currentTarget.value)}
            />
        </FieldWrapper>
    </Section>

    <Section
        heading="Contexts"
        hint="The context determines when the attack bonus applies"
        --a5e-section-body-gap="0.75rem"
    >
        <CheckboxGroup
            heading="A5E.contexts.attackType"
            options={Object.entries(attackTypes)}
            selected={attackTypesContext}
            showToggleAllButton={true}
            onUpdateSelection={(value) => {
                onUpdateValue("context.attackTypes", value);
            }}
        />

        <CheckboxGroup
            heading="A5E.contexts.spellLevel"
            options={Object.entries(spellLevels)}
            selected={spellLevelsContext}
            showToggleAllButton={true}
            onUpdateSelection={(value) => {
                onUpdateValue("context.spellLevels", value);
            }}
        />

        <Checkbox
            label="A5E.contexts.requiresProficiency"
            checked={requiresProficiency}
            onUpdateSelection={(value) => {
                onUpdateValue("context.requiresProficiency", value);
            }}
        />

        <FieldWrapper>
            <Checkbox
                label="Select Attack Bonus Automatically in Roll Prompt"
                checked={attackBonus.default ?? true}
                onUpdateSelection={(value) => {
                    onUpdateValue("default", value);
                }}
            />
        </FieldWrapper>
    </Section>
</form>
