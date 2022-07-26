<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    const actor = getContext("actor");
</script>

<li class="ac-container">
    <h4 class="ac-heading">{localize("A5E.ArmorClassAbbr")}</h4>

    <!-- <div
        v-if="sheetIsLocked"
        class="a5e-ability-score__value a5e-ability-score__value--ac"
    >
        {$actor.system.attributes.ac}
    </div> -->

    <input
        class="ac-value"
        name="system.attributes.ac"
        type="number"
        value={$actor.system.attributes.ac}
        placeholder="10"
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $actor,
                target.name,
                Number(target.value)
            )}
    />
</li>

<style lang="scss">
    .ac {
        &-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            background: rgba(0, 0, 0, 0.05);
            font-family: "Modesto Condensed", serif;
            border-radius: 3px;
            width: 100%;
        }

        &-heading {
            font-size: 1.2rem;
        }

        &-value,
        &-value[type="number"] {
            display: flex;
            align-items: center;
            height: 26px;
            border: 0;
            background: none;
            font-weight: inherit;
            text-align: center;
            margin-bottom: 1rem;
            font-size: 1.728rem;
        }
    }
</style>
