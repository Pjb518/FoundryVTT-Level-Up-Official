<script>
    import { getContext, createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../../components/Checkbox.svelte";
    import CheckboxGroup from "../../components/CheckboxGroup.svelte";
    import FieldWrapper from "../../components/FieldWrapper.svelte";
    import Section from "../../components/Section.svelte";

    export let { document, bonusID } = getContext("#external").application;
    export let jsonValue = null;

    const actor = document;
    const dispatch = createEventDispatcher();

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
        if (jsonValue === null) {
            key = `system.bonuses.senses.${bonusID}.${key}`;
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...sensesBonus,
            [key]: value,
        });
        dispatch("change", JSON.stringify(newObj));
    }

    function getSensesBonus() {
        if (jsonValue === null) return $actor.system.bonuses.senses[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.unit = obj.unit || "feet";
            obj.formula = obj.formula ?? "";
            obj.context = obj.context ?? {
                senses: [],
                otherwiseBlind: false,
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
                },
                default: true,
                img: "icons/svg/upgrade.svg",
            };
        }
    }

    const { senses, distanceUnits } = CONFIG.A5E;

    $: sensesBonus = getSensesBonus($actor, jsonValue) ?? {};
    $: sensesTypes = sensesBonus.context.senses ?? [];
    $: otherwiseBlind = sensesBonus.context.otherwiseBlind ?? false;
</script>

<form>
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
            class="bonus-image"
            src={sensesBonus.img}
            alt={sensesBonus.label}
            on:click={() => updateImage()}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={sensesBonus.label ?? ""}
                class="bonus-name"
                placeholder="Bonus Name"
                on:change={({ target }) => onUpdateValue("label", target.value)}
            />
        </div>
    </header>

    <Section
        --a5e-section-body-direction="row"
        --a5e-section-margin="0.25rem 0"
    >
        <FieldWrapper heading="A5E.Formula" --a5e-field-wrapper-grow="1">
            <input
                type="text"
                value={sensesBonus.formula ?? ""}
                on:change={({ target }) =>
                    onUpdateValue("formula", target.value)}
            />
        </FieldWrapper>

        <FieldWrapper
            heading="A5E.Unit"
            --background="none"
            --direction="column"
            --padding="0"
        >
            <select
                class="u-w-fit damage-type-select"
                on:change={({ target }) => onUpdateValue("unit", target.value)}
            >
                <option
                    value={null}
                    selected={sensesBonus.unit === "null" ||
                        sensesBonus.unit === null}
                >
                    {localize("A5E.None")}
                </option>

                {#each Object.entries(distanceUnits) as [key, name] (key)}
                    <option value={key} selected={sensesBonus.unit === key}>
                        {localize(name)}
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
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.senses", detail);
            }}
        />

        <FieldWrapper>
            <Checkbox
                label="Is Blind Beyond Vision Range"
                checked={otherwiseBlind ?? true}
                on:updateSelection={({ detail }) => {
                    onUpdateValue("context.otherwiseBlind", detail);
                }}
            />
        </FieldWrapper>
    </Section>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--padding, 0.75rem);
        gap: 0.5rem;
        background: var(--background, $color-sheet-background);
    }

    .bonus-name,
    .bonus-name[type="text"] {
        font-family: $font-primary;
        font-size: $font-size-xxl;
        border: 0;
        background: transparent;
        text-overflow: ellipsis;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .bonus-image {
        width: 2rem;
        height: 2rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .name-wrapper {
        width: 100%;
    }

    .sheet-header {
        display: flex;
        align-items: center;
    }
</style>
