<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let actionId;
    export let item;

    function addRoll() {
        const newRoll = {
            type: "attack",
        };

        $item.update({
            [`system.actions.${actionId}.rolls`]: {
                ...action.rolls,
                [foundry.utils.randomID()]: newRoll,
            },
        });
    }

    function deleteRoll(event) {
        const { rollId } = event.target.closest(".roll").dataset;

        item.get("document").update({
            [`system.actions.${actionId}.rolls`]: {
                [`-=${rollId}`]: null,
            },
        });
    }

    $: action = $item.system.actions[actionId];
</script>

<header class="section-header">
    <h2>Rolls</h2>

    <a on:click={addRoll}>+ Add Roll</a>
</header>

<ul class="section-list">
    {#each Object.entries(action.rolls ?? {}) as [id, roll] (id)}
        <li class="roll" data-roll-id={id}>
            <div>
                <label for={`${actionId}-${id}-roll-type`}>Roll Type</label>

                <select
                    id={`${actionId}-${id}-roll-type`}
                    class="u-w-fit"
                    name={`${actionId}-${id}-roll-type`}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.rolls.${id}.type`,
                            target.value
                        )}
                >
                    {#each Object.entries(CONFIG.A5E.rollTypes) as [key, name] (key)}
                        <option value={key} selected={roll.type === key}>
                            {localize(name)}
                        </option>
                    {/each}
                </select>
            </div>

            {#if roll.type === "attack"}
                <div>
                    <label for={`${actionId}-${id}-proficient`}>
                        Add Proficiency Bonus
                    </label>

                    <input
                        id={`${actionId}-${id}-proficient`}
                        name={`${actionId}-${id}-proficient`}
                        type="checkbox"
                        checked={roll.proficient ?? true}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.rolls.${id}.proficient`,
                                target.checked
                            )}
                    />
                </div>

                <div>
                    <label for={`${actionId}-${id}-attack-bonus`}
                        >Attack Bonus</label
                    >

                    <input
                        id={`${actionId}-${id}-attack-bonus`}
                        name={`${actionId}-${id}-attack-bonus`}
                        type="text"
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.rolls.${id}.bonus`,
                                target.value
                            )}
                    />
                </div>

                <div>
                    <label for={`${actionId}-${id}-crit-threshold`}>
                        Critical Hit Threshold
                    </label>

                    <input
                        id={`${actionId}-${id}-crit-threshold`}
                        name={`${actionId}-${id}-crit-threshold`}
                        type="number"
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.rolls.${id}.critThreshold`,
                                Number(target.value)
                            )}
                    />
                </div>
            {/if}

            <i class="delete-button fas fa-trash" on:click={deleteRoll} />
        </li>
    {:else}
        <li class="none">None</li>
    {/each}
</ul>

<style lang="scss">
    .delete-button {
        color: #8b2525;
        margin-left: auto;
        margin-right: 0.5rem;
        padding: 0.25rem;
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
            transform: scale(1.2);
        }
    }

    .none {
        color: #555;
        text-align: center;
        font-size: 1rem;
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.25rem 0.25rem 0.25rem;
        font-family: "Modesto Condensed", serif;
        font-size: 1rem;
        border-bottom: 1px solid #ccc;
    }

    .roll {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        border: 1px solid #bbb;
        border-radius: 3px;
        font-size: 1rem;
    }

    .section-list {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        list-style: none;
        font-family: "Modesto Condensed", serif;
    }
</style>
