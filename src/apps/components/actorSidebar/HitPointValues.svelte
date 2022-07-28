<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let hp;
    export let hpFields;

    $: hpFields = [
        {
            key: "temp",
            label: "Temp. HP",
            value: hp.temp,
        },
        {
            key: "value",
            label: "Curr. HP",
            value: hp.value,
        },
        {
            key: "max",
            label: "Max HP",
            value: hp.max,
        },
        {
            key: "bonus",
            label: "Bonus HP",
            value: hp.bonus,
        },
    ];

    const actor = getContext("actor");
</script>

<div class="hp-container">
    {#each hpFields as { key, label, value }}
        <div class="hp-box">
            <label class="hp-label" for="{$actor.id}-current-hp">{label}</label>

            <input
                id="{$actor.id}-hp-{key}"
                class="hp-input"
                type="number"
                name="system.attributes.hp.{key}"
                {value}
                placeholder="0"
                min={key !== "bonus" ? 0 : ""}
                disabled={key === "max"}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value)
                    )}
                on:click={({ target }) => target.select()}
            />
        </div>
    {/each}
</div>

<style lang="scss">
    .hp-container {
        display: flex;
        gap: 0.25rem;
    }

    .hp-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 3.5rem;
        font-size: 1rem;
        font-family: "Modesto Condensed", serif;
        color: #7e7960;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #f6f2eb;
        box-shadow: 0 0 10px #ccc inset;
        z-index: 4;
    }

    .hp-label {
        font-size: 0.694rem;
    }

    .hp-input {
        text-align: center;
        border: 0;
        background: transparent;
        padding-left: 0.25rem;
        padding-right: 0.25rem;
        font-size: 1.2rem;

        &:active,
        &:focus {
            outline: 0;
            box-shadow: none;
        }
    }
</style>
