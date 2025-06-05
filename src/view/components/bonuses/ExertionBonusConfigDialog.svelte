<script lang="ts">
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        document: any;
        bonusID: string;
        jsonValue?: JSON;
        onchange?: (value: string) => void;
    };

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
        if (jsonValue === undefined) {
            key = `system.bonuses.exertion.${bonusID}.${key}`;
            updateDocumentDataFromField(actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...exertionBonus,
            [key]: value,
        });

        onchange?.(JSON.stringify(newObj));
    }

    function getExertionBonus() {
        if (jsonValue === undefined)
            return actor.reactive.system.bonuses.exertion[bonusID];

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

    let {
        document,
        bonusID,
        jsonValue = undefined,
        onchange = undefined,
    }: Props = $props();

    let actor = document;

    let exertionBonus = $derived(getExertionBonus() ?? {});
</script>

<form class="a5e-bonus">
    <header class="a5e-bonus__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-bonus-image"
            src={exertionBonus.img}
            alt={exertionBonus.label}
            onclick={() => updateImage()}
        />

        <div class="a5e-bonus-name-wrapper">
            <input
                class="a5e-input a5e-bonus-name"
                type="text"
                name="name"
                value={exertionBonus.label ?? ""}
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
                value={exertionBonus.formula ?? ""}
                onchange={({ currentTarget }) =>
                    onUpdateValue("formula", currentTarget.value)}
            />
        </FieldWrapper>
    </Section>
</form>
