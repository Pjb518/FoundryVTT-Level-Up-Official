<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const actionId = getContext("actionId");

    const { abilities, skills } = CONFIG.A5E;

    export let prompt;
    export let promptId;
</script>

<section class="action-config__wrapper">
    <div class="a5e-field-group a5e-field-group--label">
        <label for="{actionId}-{promptId}-label">
            {localize("A5E.Label")}
        </label>

        <input
            id="{actionId}-{promptId}-label"
            type="text"
            value={prompt.label ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.prompts.${promptId}.label`,
                    target.value
                )}
        />
    </div>

    <div class="option-wrapper">
        <h3 class="a5e-field-group__heading">
            {localize("A5E.Skill")}
        </h3>

        <select
            class="u-w-fit"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${promptId}.skill`,
                    target.value
                )}
        >
            <!-- svelte-ignore missing-declaration -->
            <option value="" selected={foundry.utils.isEmpty(prompt?.skill)}>
                {localize("A5E.None")}
            </option>

            {#each Object.entries(skills) as [skill, label]}
                <option value={skill} selected={prompt?.skill === skill}>
                    {localize(label)}
                </option>
            {/each}
        </select>
    </div>

    <div class="a5e-field-group">
        <h3 class="a5e-field-group__heading">
            {localize("A5E.ItemAbilityCheckType")}
        </h3>

        <div class="option-list">
            <input
                class="option-input"
                type="radio"
                id="{actionId}-{promptId}-ability-none"
                value=""
                checked={(prompt.ability ?? true) || prompt.ability === ""}
                on:change={() =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.prompts.${promptId}`,
                        { "-=ability": null }
                    )}
            />

            <label
                class="option-label"
                for="{actionId}-{promptId}-ability-none"
            >
                {localize("A5E.None")}
            </label>

            {#each Object.entries(abilities) as [ability, label]}
                <input
                    class="option-input"
                    type="radio"
                    id="{actionId}-{promptId}-ability-{ability}"
                    value={ability}
                    checked={prompt.ability === ability}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.prompts.${promptId}.ability`,
                            target.value
                        )}
                />

                <label
                    class="option-label"
                    for="{actionId}-{promptId}-ability-{ability}"
                >
                    {localize(label)}
                </label>
            {/each}
        </div>
    </div>

    <div class="a5e-field-group a5e-field-group--formula">
        <label for="{actionId}-{promptId}-dc">
            {localize("A5E.ItemSkillCheckDC")}
        </label>

        <input
            id="{actionId}-{promptId}-dc"
            type="text"
            value={prompt.skillDC ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.prompts.${promptId}.skillDC`,
                    target.value
                )}
        />
    </div>

    <div class="a5e-field-group ">
        <label for="{actionId}-{promptId}-save-effect">
            {localize("A5E.ItemEffectOnCheck")}
        </label>

        <input
            id="{actionId}-{promptId}-save-effect"
            type="text"
            value={prompt.onSave ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.prompts.${promptId}.onSave`,
                    target.value
                )}
        />
    </div>
</section>

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
            font-size: 0.694rem;
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
