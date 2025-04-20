<script lang="ts">
    import { getContext } from "svelte";

    import { editDocumentImage } from "#utils/view/editDocumentImage.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    async function onEditImage(event) {
        await editDocumentImage(actor, { shiftKey: event.shiftKey });
    }

    let actor = getContext("actor");

    let hp = $derived(actor.reactive.system.attributes.hp);

    let hpFields = $derived([
        { key: "temp", label: "Temp. HP", value: hp.temp },
        { key: "value", label: "Curr. HP", value: hp.value },
        { key: "max", label: "Max HP", value: hp.max },
        { key: "bonus", label: "Bonus HP", value: hp.bonus },
    ]);
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<img
    class="a5e-portrait-image"
    src={actor.img}
    alt={actor.name}
    onclick={onEditImage}
/>

<div class="a5e-hp-bar__container">
    <!-- Main Hp Bar -->
    <div class="a5e-hp-bar__main">
        <input
            class="a5e-input a5e-input--hp"
            type="text"
            value={hp.value ?? 0}
            onchange={({ target }) =>
                updateDocumentDataFromField(
                    actor,
                    "system.attributes.hp.value",
                    Number(target.value), // TODO: Change this to accept + - input
                )}
        />

        /

        <span class="a5e-hp-bar__main--max-hp"> {hp.max} </span>
    </div>

    <!-- Temp Hp -->
    <div class="a5e-hp-bar__unit">
        <label for="">Temp Hp</label>

        <input
            class="a5e-input a5e-input--small a5e-input--hp-temp"
            type="number"
            value={hp.temp ?? 0}
            onchange={({ target }) =>
                updateDocumentDataFromField(
                    actor,
                    "system.attributes.hp.temp",
                    Number(target.value),
                )}
        />
    </div>

    <!-- Bonus Hp -->
    <div class="a5e-hp-bar__unit">
        <label for="">Bonus Hp</label>

        <input
            class="a5e-input a5e-input--small a5e-input--hp-bonus"
            type="number"
            value={hp.bonus ?? 0}
            onchange={({ target }) =>
                updateDocumentDataFromField(
                    actor,
                    "system.attributes.hp.bonus",
                    Number(target.value),
                )}
        />
    </div>

    <!-- Hit Dice -->
    <div class="a5e-hp-bar__unit">
        <label for="">Hit Dice</label>
        <input
            class="a5e-input a5e-input--small a5e-input--hp-bonus"
            type="number"
            value={hp.bonus ?? 0}
            onchange={({ target }) =>
                updateDocumentDataFromField(
                    actor,
                    "system.attributes.hp.bonus",
                    Number(target.value),
                )}
        />
    </div>
</div>

<style lang="scss">
    .a5e-portrait-image {
        width: 8rem;
        margin-inline: auto;
        border-radius: 4px;
    }

    .a5e-hp-bar {
        &__container {
            display: flex;
            gap: 0.25rem;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-evenly;

            margin-block: 0.5rem;
            border: 1px solid blue;
        }

        &__main {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            border: 1px solid black;

            font-family: var(--a5e-primary-font);
            font-size: var(--a5e-sm-text);
            font-weight: 600;
            gap: 0.5rem;

            &--max-hp {
                padding: 0 0.55rem;
            }
        }

        &__unit {
            display: flex;
            flex-direction: column;
            width: 30%;
            font-family: var(--a5e-mono-font);
            font-size: var(--a5e-sm-text);
            text-align: center;
            font-weight: 400;

            gap: 0.125rem;
        }
    }
</style>
