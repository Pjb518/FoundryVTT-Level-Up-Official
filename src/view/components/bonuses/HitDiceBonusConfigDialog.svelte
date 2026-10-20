<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        document?: any;
        bonusID?: string;
        data?: Record<string, any>;
        onchange?: (value: Record<string, any>) => void;
    };

    function updateImage() {
        const current = hitDiceBonus?.img;

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
        if (data === undefined) {
            key = `system.bonuses.hitDice.${bonusID}.${key}`;
            updateDocumentDataFromField(actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...hitDiceBonus,
            [key]: value,
        });

        onchange?.(newObj);
    }

    function getHitDiceBonus() {
        if (data === undefined)
            return actor.reactive.system.bonuses.hitDice[bonusID];

        try {
            const obj = data ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.bonusType = obj.bonusType ?? "add";
            obj.context = obj.context ?? {
                hitDiceTypes: [],
                perDie: false,
            };
            obj.img = obj.img || "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                bonusType: "add",
                context: {
                    hitDiceTypes: [],
                    perDie: false,
                },
                img: "icons/svg/upgrade.svg",
            };
        }
    }

    let {
        document,
        bonusID = "",
        data = undefined,
        onchange = undefined,
    }: Props = $props();

    let actor = document;

    const { hitDiceBonusContexts, hitDiceBonusTypes } = CONFIG.A5E;

    let hitDiceBonus = $derived(getHitDiceBonus() ?? {});
    let hitDiceTypesContext = $derived(hitDiceBonus.context?.hitDiceTypes ?? []);
    let isOverride = $derived(["override", "modifier"].includes(hitDiceBonus.bonusType));
</script>

<form class="a5e-bonus">
    <header class="a5e-bonus__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-bonus-image"
            src={hitDiceBonus.img}
            alt={hitDiceBonus.label}
            onclick={() => updateImage()}
        />

        <div class="a5e-bonus-name-wrapper">
            <input
                class="a5e-input a5e-bonus-name"
                type="text"
                name="name"
                value={hitDiceBonus.label ?? ""}
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
        <FieldWrapper
            heading="A5E.rollLabels.formula"
            --a5e-field-wrapper-grow="1"
        >
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={hitDiceBonus.formula ?? ""}
                onchange={({ currentTarget }) =>
                    onUpdateValue("formula", currentTarget.value)}
            />
        </FieldWrapper>

    <FieldWrapper heading="A5E.contexts.bonusType">
      <select
        class="a5e-input a5e-input--slim a5e-input--fit"
        onchange={({ currentTarget }) =>
          onUpdateValue("bonusType", currentTarget.value)}
      >
        {#each Object.entries(hitDiceBonusTypes) as [key, name] (key)}
          <option value={key} selected={hitDiceBonus.bonusType === key}>
            {localize(name as string)}
          </option>
        {/each}
      </select>
    </FieldWrapper>

    </Section>

    <Section
        heading="Contexts"
        hint="The context determines when the hit dice bonus applies"
        --a5e-section-body-gap="0.75rem"
    >
        <CheckboxGroup
            heading="A5E.contexts.hitDiceType"
            options={Object.entries(hitDiceBonusContexts)}
            selected={hitDiceTypesContext}
            showToggleAllButton={true}
            onUpdateSelection={(value) =>
                onUpdateValue("context.hitDiceTypes", value)}
        />

    {#if !isOverride}
        <FieldWrapper>
            <Checkbox
                label="A5E.contexts.perDie"
                checked={hitDiceBonus.context?.perDie ?? false}
                onUpdateSelection={(value) => {
                    onUpdateValue("context.perDie", value);
                }}
            />
        </FieldWrapper>
    {/if}
    </Section>
</form>
