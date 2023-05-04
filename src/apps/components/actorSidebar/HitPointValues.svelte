<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

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

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

{#if sheetIsLocked}
    <div class="hp-container">
        {#each hpFields as { key, label, value }}
            <div class="hp-box">
                <label class="hp-label" for="{$actor.id}-hp-{key}"
                    >{label}</label
                >

                <input
                    id="{$actor.id}-hp-{key}"
                    class="hp-input"
                    class:disable-pointer-events={!$actor.isOwner}
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
{:else}
    <div class="hp-config__container">
        <button class="a5e-button" on:click={() => $actor.configureHealth()}>
            <i class="fas fa-gear" />
            {localize("A5E.HitPointsConfigurationTooltip")}
        </button>
    </div>
{/if}

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

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
        padding: 0.125rem 0;
        font-family: "Modesto Condensed", serif;
        color: #7e7960;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #f6f2eb;
        box-shadow: 0 0 5px #ccc inset;
        z-index: 4;
    }

    .hp-label {
        font-size: 0.694rem;
    }

    .hp-input {
        height: unset;
        text-align: center;
        border: 0;
        background: transparent;
        padding-inline: 0.25rem;
        font-size: 1rem;

        &:active,
        &:focus {
            outline: 0;
            box-shadow: none;
        }
    }

    .hp-config__container {
        padding-block: 0.275rem;
        button {
            padding: 0.125rem 0;
            background: transparent;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 0 5px #ccc inset;
        }
    }
</style>
