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
        const current = damageBonus?.img;

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
            key = `system.bonuses.damage.${bonusID}.${key}`;
            updateDocumentDataFromField(actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...damageBonus,
            [key]: value,
        });

        onchange?.(JSON.stringify(newObj));
    }

    function getDamageBonus() {
        if (jsonValue === undefined)
            return actor.reactive.system.bonuses.damage[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.damageType = obj.damageType ?? "";
            obj.context = obj.context ?? {
                attackTypes: [],
                damageTypes: [],
                spellLevels: [],
                isCritBonus: false,
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
                    attackTypes: [],
                    damageTypes: [],
                    spellLevels: [],
                    isCritBonus: false,
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

    const { damageBonusContexts, damageTypes, spellLevels } = CONFIG.A5E;

    let damageBonus = $derived(getDamageBonus() ?? {});
    let attackTypesContext = $derived(damageBonus.context.attackTypes ?? []);
    let damageTypesContext = $derived(damageBonus.context.damageTypes ?? []);
    let isCritBonus = $derived(damageBonus.context.isCritBonus ?? false);
    let spellLevelsContext = $derived(damageBonus.context.spellLevels ?? []);
</script>

<form class="a5e-bonus">
    <header class="a5e-bonus__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-bonus-image"
            src={damageBonus.img}
            alt={damageBonus.label}
            onclick={() => updateImage()}
        />

        <div class="a5e-bonus-name-wrapper">
            <input
                class="a5e-input a5e-bonus-name"
                type="text"
                name="name"
                value={damageBonus.label ?? ""}
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
        <FieldWrapper heading="A5E.DamageFormula" --a5e-field-wrapper-grow="1">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={damageBonus.formula ?? ""}
                onchange={({ currentTarget }) =>
                    onUpdateValue("formula", currentTarget.value)}
            />
        </FieldWrapper>

        <FieldWrapper
            heading="A5E.DamageType"
            --background="none"
            --direction="column"
            --padding="0"
        >
            <select
                class="a5e-input a5e-input--slim a5e-input--fit"
                onchange={({ currentTarget }) =>
                    onUpdateValue("damageType", currentTarget.value)}
            >
                <option
                    value={null}
                    selected={damageBonus.damageType === "null" ||
                        damageBonus.damageType === null}
                >
                    {localize("A5E.None") as string}
                </option>

                {#each Object.entries(damageTypes) as [key, name] (key)}
                    <option
                        value={key}
                        selected={damageBonus.damageType === key}
                    >
                        {localize(name)}
                    </option>
                {/each}
            </select>
        </FieldWrapper>
    </Section>

    <Section
        heading="Contexts"
        hint="The context determines when the damage bonus applies"
        --a5e-section-body-gap="0.75rem"
    >
        <CheckboxGroup
            heading="A5E.contexts.attackType"
            options={Object.entries(damageBonusContexts)}
            selected={attackTypesContext}
            showToggleAllButton={true}
            onUpdateSelection={(value) => {
                onUpdateValue("context.attackTypes", value);
            }}
        />

        <CheckboxGroup
            heading="A5E.contexts.damageType"
            options={Object.entries(damageTypes)}
            selected={damageTypesContext}
            showToggleAllButton={true}
            onUpdateSelection={(value) => {
                onUpdateValue("context.damageTypes", value);
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
            label="This bonus only applies to critical hits."
            checked={isCritBonus}
            onUpdateSelection={(value) => {
                onUpdateValue("context.isCritBonus", value);
            }}
        />

        <FieldWrapper>
            <Checkbox
                label="Select Damage Bonus Automatically in Roll Prompt"
                checked={damageBonus.default ?? true}
                onUpdateSelection={(value) => {
                    onUpdateValue("default", value);
                }}
            />
        </FieldWrapper>
    </Section>
</form>
