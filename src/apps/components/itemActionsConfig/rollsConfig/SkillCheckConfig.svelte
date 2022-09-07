<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const { abilities, skills } = CONFIG.A5E;

    export let actionId;
    export let item;
    export let roll;
    export let rollId;
</script>

<div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <div class="option-wrapper">
        <h3>Skill</h3>

        <div class="option-list">
            {#each Object.entries(skills) as [skill, label] (skill)}
                <input
                    class="option-input"
                    type="radio"
                    name={`${actionId}-${rollId}-skill`}
                    id={`${actionId}-${rollId}-skill-${skill}`}
                    value={skill}
                    checked={roll.skill === skill}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.rolls.${rollId}.skill`,
                            target.value
                        )}
                />

                <label
                    class="option-label"
                    for={`${actionId}-${rollId}-skill-${skill}`}
                >
                    {localize(label)}
                </label>
            {/each}
        </div>
    </div>

    <div class="option-wrapper">
        <h3>Default Ability Score</h3>

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

            {#each Object.entries(abilities) as [ability, label]}
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
                    {localize(label)}
                </label>
            {/each}
        </div>
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
