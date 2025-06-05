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
        const current = sensesBonus?.img;

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
            key = `system.bonuses.senses.${bonusID}.${key}`;
            updateDocumentDataFromField(actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...sensesBonus,
            [key]: value,
        });

        onchange?.(JSON.stringify(newObj));
    }

    function getSensesBonus() {
        if (jsonValue === undefined)
            return actor.reactive.system.bonuses.senses[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.unit = obj.unit || "feet";
            obj.formula = obj.formula ?? "";
            obj.context = obj.context ?? {
                senses: [],
                otherwiseBlind: false,
                // valueIfOriginalIsZero: "",
            };
            obj.img = obj.img || "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                unit: "feet",
                formula: "",
                damageType: "",
                context: {
                    senses: [],
                    otherwiseBlind: false,
                    // valueIfOriginalIsZero: "",
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

    const { senses, visionUnits } = CONFIG.A5E;

    let sensesBonus = $derived(getSensesBonus() ?? {});
    let sensesTypes = $derived(sensesBonus.context.senses ?? []);
    let otherwiseBlind = $derived(sensesBonus.context.otherwiseBlind ?? false);
</script>

<form class="a5e-bonus">
    <header class="a5e-bonus__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-bonus-image"
            src={sensesBonus.img}
            alt={sensesBonus.label}
            onclick={() => updateImage()}
        />

        <div class="a5e-name-wrapper">
            <input
                class="a5e-input a5e-bonus-name"
                type="text"
                name="name"
                value={sensesBonus.label ?? ""}
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
        <FieldWrapper heading="A5E.Formula" --a5e-field-wrapper-grow="1">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={sensesBonus.formula ?? ""}
                onchange={({ currentTarget }) =>
                    onUpdateValue("formula", currentTarget.value)}
            />
        </FieldWrapper>

        <FieldWrapper
            heading="A5E.Unit"
            --background="none"
            --direction="column"
            --padding="0"
        >
            <select
                class="a5e-input a5e-input--slim a5e-input--fit"
                onchange={({ currentTarget }) =>
                    onUpdateValue("unit", currentTarget.value)}
            >
                <option
                    value={null}
                    selected={sensesBonus.unit === "null" ||
                        sensesBonus.unit === null}
                >
                    {localize("A5E.None")}
                </option>

                {#each Object.entries(visionUnits) as [key, name] (key)}
                    <option value={key} selected={sensesBonus.unit === key}>
                        {localize(name as string)}
                    </option>
                {/each}
            </select>
        </FieldWrapper>
    </Section>

    <Section
        heading="Contexts"
        hint="The context determines when the ability bonus applies"
        --a5e-section-body-gap="0.75rem"
    >
        <CheckboxGroup
            heading="A5E.contexts.senses"
            options={Object.entries(senses)}
            selected={sensesTypes}
            showToggleAllButton={true}
            onUpdateSelection={(value) => {
                onUpdateValue("context.senses", value);
            }}
        />

        <FieldWrapper>
            <Checkbox
                label="Is Blind Beyond Vision Range"
                checked={otherwiseBlind ?? true}
                onUpdateSelection={(value) => {
                    onUpdateValue("context.otherwiseBlind", value);
                }}
            />
        </FieldWrapper>
    </Section>
</form>
