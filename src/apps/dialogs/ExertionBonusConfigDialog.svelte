<script>
    import { getContext, createEventDispatcher } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import FieldWrapper from "../components/FieldWrapper.svelte";
    import Section from "../components/Section.svelte";

    export let document;
    export let bonusID;
    export let jsonValue = null;

    const actor = document;
    const dispatch = createEventDispatcher();

    function updateImage() {
        const current = exertionBonus?.img;

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
            key = `system.bonuses.exertion.${bonusID}.${key}`;
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...exertionBonus,
            [key]: value,
        });
        dispatch("change", JSON.stringify(newObj));
    }

    function getExertionBonus() {
        if (jsonValue === null) return $actor.system.bonuses.exertion[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.formula = obj.formula ?? "";
            obj.img = obj.img || "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                img: "icons/svg/upgrade.svg",
            };
        }
    }

    $: exertionBonus = getExertionBonus($actor, jsonValue) ?? {};
</script>

<form>
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
            class="bonus-image"
            src={exertionBonus.img}
            alt={exertionBonus.label}
            on:click={() => updateImage()}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={exertionBonus.label ?? ""}
                class="bonus-name"
                placeholder="Bonus Name"
                on:change={({ target }) => onUpdateValue("label", target.value)}
            />
        </div>
    </header>

    <Section --a5e-section-margin="0.25rem 0">
        <FieldWrapper heading="A5E.Formula">
            <input
                type="text"
                value={exertionBonus.formula ?? ""}
                on:change={({ target }) =>
                    onUpdateValue("formula", target.value)}
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
        background: var(--background, var(--a5e-color-background-sheet));
    }

    .bonus-name,
    .bonus-name[type="text"] {
        font-family: var(--a5e-font-primary);
        font-size: var(--a5e-text-size-xxl);
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
