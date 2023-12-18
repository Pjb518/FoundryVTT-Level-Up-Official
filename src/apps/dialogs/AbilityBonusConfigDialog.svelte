<script>
    import { getContext, createEventDispatcher } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/FormSection.svelte";
    import TagGroup from "../components/TagGroup.svelte";

    export let { actor, abilityBonusId } = getContext("#external").application;
    export let jsonValue = null;

    const dispatch = createEventDispatcher();

    function updateImage() {
        const current = abilityBonus?.img;

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
            key = `system.bonuses.abilities.${abilityBonusId}.${key}`;
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...abilityBonus,
            [key]: value,
        });
        dispatch("change", JSON.stringify(newObj));
    }

    function getAbilityBonus() {
        if (jsonValue === null)
            return $actor.system.bonuses.abilities[abilityBonusId];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.context = obj.context ?? {};
            obj.default = obj.default ?? true;
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                damageType: "",
                context: {},
                default: true,
            };
        }
    }

    const { abilities, abilityBonusContexts } = CONFIG.A5E;

    $: abilityBonus = getAbilityBonus($actor, jsonValue) ?? {};
    $: abilitiesContext = abilityBonus.context?.abilities ?? [];
    $: abilityTypeContext = abilityBonus.context?.types ?? [];
    $: requiresProficiency = abilityBonus.context?.requiresProficiency ?? false;
</script>

<form>
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
            class="bonus-image"
            src={abilityBonus.img}
            alt={abilityBonus.label}
            on:click={() => updateImage()}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={abilityBonus.label ?? ""}
                class="bonus-name"
                placeholder="Bonus Name"
                on:change={({ target }) => onUpdateValue("label", target.value)}
            />
        </div>
    </header>

    <FormSection>
        <FormSection
            heading="A5E.Formula"
            --background="none"
            --grow="1"
            --direction="column"
            --padding="0"
        >
            <input
                type="text"
                value={abilityBonus.formula ?? ""}
                on:change={({ target }) =>
                    onUpdateValue("formula", target.value)}
            />
        </FormSection>
    </FormSection>

    <FormSection
        heading="Contexts"
        hint="The context determines when the ability bonus applies"
        --direction="column"
    >
        <TagGroup
            heading="A5E.contexts.abilities"
            options={Object.entries(abilities)}
            selected={abilitiesContext}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.abilities", detail);
            }}
        />

        <TagGroup
            heading="A5E.contexts.bonusTypes"
            options={Object.entries(abilityBonusContexts)}
            selected={abilityTypeContext}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.types", detail);
            }}
        />

        <Checkbox
            label="A5E.contexts.requiresProficiency"
            checked={requiresProficiency}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.requiresProficiency", detail);
            }}
        />
    </FormSection>

    <FormSection>
        <Checkbox
            label="Select Ability Bonus Automatically in Roll Prompt"
            checked={abilityBonus.default ?? true}
            on:updateSelection={({ detail }) => {
                onUpdateValue("default", detail);
            }}
        />
    </FormSection>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--padding, 0.75rem);
        gap: 0.5rem;
        overflow: auto;
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
