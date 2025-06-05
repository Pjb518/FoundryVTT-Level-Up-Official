<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

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
        const current = healingBonus?.img;

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
            key = `system.bonuses.healing.${bonusID}.${key}`;
            updateDocumentDataFromField(actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...healingBonus,
            [key]: value,
        });

        onchange?.(JSON.stringify(newObj));
    }

    function getHealingBonus() {
        if (jsonValue === undefined)
            return actor.reactive.system.bonuses.healing[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.healingType = obj.healingType ?? "";
            obj.context = obj.context ?? {
                healingTypes: [],
                spellLevels: [],
            };
            obj.default = obj.default ?? true;
            obj.img = obj.img || "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                healingType: "",
                context: {
                    healingTypes: [],
                    spellLevels: [],
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

    const { healingBonusContexts, healingTypes, spellLevels } = CONFIG.A5E;

    let healingBonus = $derived(getHealingBonus() ?? {});
    let healingTypesContext = $derived(healingBonus.context.healingTypes ?? []);
    let spellLevelsContext = $derived(healingBonus.context.spellLevels ?? []);
</script>

<form class="a5e-bonus">
    <header class="a5e-bonus__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-bonus-image"
            src={healingBonus.img}
            alt={healingBonus.label}
            onclick={() => updateImage()}
        />

        <div class="a5e-bonus-name-wrapper">
            <input
                class="a5e-input a5e-bonus-name"
                type="text"
                name="name"
                value={healingBonus.label ?? ""}
                placeholder="Bonus Name"
                onchange={({ currentTarget }) =>
                    onUpdateValue("label", currentTarget.value)}
            />
        </div>
    </header>

    <Section
        --a5e-section-body-direction="row"
        --a5e-section-margin="0.25rem 0"
    >
        <FieldWrapper heading="A5E.HealingFormula" --a5e-field-wrapper-grow="1">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={healingBonus.formula ?? ""}
                onchange={({ currentTarget }) =>
                    onUpdateValue("formula", currentTarget.value)}
            />
        </FieldWrapper>

        <FieldWrapper heading="A5E.HealingType">
            <select
                class="a5e-input a5e-input--slim a5e-input--fit"
                onchange={({ currentTarget }) =>
                    onUpdateValue("healingType", currentTarget.value)}
            >
                <option
                    value={null}
                    selected={healingBonus.healingType === "null" ||
                        healingBonus.healingType === null}
                >
                    {localize("A5E.None")}
                </option>

                {#each Object.entries(healingTypes) as [key, name] (key)}
                    <option
                        value={key}
                        selected={healingBonus.healingType === key}
                    >
                        {localize(name as string)}
                    </option>
                {/each}
            </select>
        </FieldWrapper>
    </Section>

    <Section
        heading="Contexts"
        hint="The context determines when the healing bonus applies"
        --a5e-section-body-gap="0.75rem"
    >
        <CheckboxGroup
            heading="A5E.contexts.healingType"
            options={Object.entries(healingBonusContexts)}
            selected={healingTypesContext}
            showToggleAllButton={true}
            onUpdateSelection={(value) =>
                onUpdateValue("context.healingTypes", value)}
        />

        <CheckboxGroup
            heading="A5E.contexts.spellLevel"
            options={Object.entries(spellLevels)}
            selected={spellLevelsContext}
            showToggleAllButton={true}
            onUpdateSelection={(value) =>
                onUpdateValue("context.spellLevels", value)}
        />

        <FieldWrapper>
            <Checkbox
                label="Select Healing Bonus Automatically in Roll Prompt"
                checked={healingBonus.default ?? true}
                onUpdateSelection={(value) => {
                    onUpdateValue("default", value);
                }}
            />
        </FieldWrapper>
    </Section>
</form>
