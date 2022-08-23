<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import RollTypeConfig from "./RollTypeConfig.svelte";

    export let action;
    export let actionId;
    export let item;
    export let roll;
    export let rollId;
</script>

<div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <RollTypeConfig {action} {actionId} {item} {roll} {rollId} />

    <div class="option-wrapper">
        <h3>Ability Check Type</h3>

        <div class="option-list">
            <input
                class="option-input"
                type="radio"
                name={`${actionId}-${rollId}-ability`}
                id={`${actionId}-${rollId}-ability-none`}
                value=""
                checked={(roll.ability ?? true) || roll.ability === ""}
                on:change={() =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.rolls.${rollId}`,
                        { "-=ability": null }
                    )}
            />

            <label
                class="option-label"
                for={`${actionId}-${rollId}-ability-none`}
            >
                {localize("A5E.None")}
            </label>

            {#each ["str", "dex", "con", "int", "wis", "cha"] as ability}
                <input
                    class="option-input"
                    type="radio"
                    name={`${actionId}-${rollId}-ability`}
                    id={`${actionId}-${rollId}-ability-${ability}`}
                    value={ability}
                    checked={roll.ability === ability}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.rolls.${rollId}.ability`,
                            target.value
                        )}
                />

                <label
                    class="option-label"
                    for={`${actionId}-${rollId}-ability-${ability}`}
                >
                    {localize(CONFIG.A5E.abilities[ability])}
                </label>
            {/each}
        </div>
    </div>

    <div>
        <label for={`${actionId}-${rollId}-bonus`}> Check Bonus </label>

        <input
            id={`${actionId}-${rollId}-bonus`}
            name={`${actionId}-${rollId}-bonus`}
            type="text"
            value={roll.bonus ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.bonus`,
                    target.value
                )}
        />
    </div>
</div>

<style lang="scss">
    .option {
        &-input {
            display: none;

            &:checked + .option-label {
                background: #2b6537;
                border-color: darken($color: #2b6537, $amount: 5);
                color: #f6f2eb;
            }
        }

        &-label {
            border-radius: 3px;
            border: 1px solid #bbb;
            padding: 0.125rem 0.25rem;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
        }

        &-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
        }

        &-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            font-size: 0.694rem;
            font-family: "Signika", sans-serif;
        }
    }
</style>
