<script>
    import { getContext, createEventDispatcher } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/FormSection.svelte";
    import TagGroup from "../components/TagGroup.svelte";

    export let { actorDocument, bonusID } = getContext("#external").application;
    export let jsonValue = null;

    const actor = new TJSDocument(actorDocument);
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
            key = `system.bonuses.damage.${bonusID}.${key}`;
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...damageBonus,
            [key]: value,
        });
        dispatch("change", JSON.stringify(newObj));
    }

    function getDamageBonus() {
        if (jsonValue === null) return $actor.system.bonuses.damage[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.damageType = obj.damageType ?? "";
            obj.context = obj.context ?? {};
            obj.default = obj.default ?? true;
            obj.img = obj.img ?? "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                damageType: "",
                context: {},
                default: true,
                img: "icons/svg/upgrade.svg",
            };
        }
    }

    const { damageBonusContexts, damageTypes, spellLevels } = CONFIG.A5E;

    $: damageBonus = getDamageBonus($actor, jsonValue) ?? {};
    $: attackTypesContext = damageBonus.context.attackTypes ?? [];
    $: damageTypesContext = damageBonus.context.damageTypes ?? [];
    $: isCritBonus = damageBonus.context.isCritBonus ?? false;
    $: spellLevelsContext = damageBonus.context.spellLevels ?? [];
</script>

<form>
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
            class="bonus-image"
            src={damageBonus.img}
            alt={damageBonus.label}
            on:click={() => updateImage()}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={damageBonus.label ?? ""}
                class="bonus-name"
                placeholder="Bonus Name"
                on:change={({ target }) => onUpdateValue("label", target.value)}
            />
        </div>
    </header>

    <FormSection>
        <FormSection
            heading="A5E.DamageFormula"
            --background="none"
            --grow="1"
            --direction="column"
            --padding="0"
        >
            <input
                type="text"
                value={damageBonus.formula ?? ""}
                on:change={({ target }) =>
                    onUpdateValue("formula", target.value)}
            />
        </FormSection>

        <FormSection
            heading="A5E.DamageType"
            --background="none"
            --direction="column"
            --padding="0"
        >
            <select
                class="u-w-fit damage-type-select"
                on:change={({ target }) =>
                    onUpdateValue("damageType", target.value)}
            >
                <option
                    value={null}
                    selected={damageBonus.damageType === "null" ||
                        damageBonus.damageType === null}
                >
                    {localize("A5E.None")}
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
        </FormSection>
    </FormSection>

    <FormSection
        heading="Contexts"
        hint="The context determines when the damage bonus applies"
        --direction="column"
    >
        <TagGroup
            heading="A5E.contexts.attackType"
            options={Object.entries(damageBonusContexts)}
            selected={attackTypesContext}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.attackTypes", detail);
            }}
        />

        <TagGroup
            heading="A5E.contexts.damageType"
            options={Object.entries(damageTypes)}
            selected={damageTypesContext}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.damageTypes", detail);
            }}
        />

        <TagGroup
            heading="A5E.contexts.spellLevel"
            options={Object.entries(spellLevels)}
            selected={spellLevelsContext}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.spellLevels", detail);
            }}
        />

        <Checkbox
            label="This bonus only applies to critical hits."
            checked={isCritBonus}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.isCritBonus", detail);
            }}
        />
    </FormSection>

    <FormSection>
        <Checkbox
            label="Select Damage Bonus Automatically in Roll Prompt"
            checked={damageBonus.default ?? true}
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
