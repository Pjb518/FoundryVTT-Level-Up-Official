<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import localeSort from "../../../utils/localeSort";
    import objectEntriesNumberKeyConverter from "../../../utils/objectEntriesNumberKeyConverter";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Tag from "../Tag.svelte";

    const item = getContext("item");
    const appId = getContext("appId");
    const { A5E } = CONFIG;

    let editMode = false;

    function toggleEditMode() {
        editMode = !editMode;
    }
</script>

<section>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <header
        class="
            u-align-center
            u-flex
            u-font-serif
            u-gap-md
            u-mb-lg
            u-ml-xs
            u-pointer
            u-text-lg
            u-w-fit
        "
        on:click={toggleEditMode}
    >
        <h3>{localize("A5E.TabSpellConfiguration")}</h3>
        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.SpellLevel">
                <RadioGroup
                    options={objectEntriesNumberKeyConverter(A5E.spellLevels)}
                    selected={$item.system.level}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.level",
                            event.detail
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.SpellSchoolPrimary">
                <RadioGroup
                    options={Object.entries(A5E.spellSchools.primary)}
                    selected={$item.system.schools.primary}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.schools.primary",
                            event.detail
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.SpellSchoolSecondaryPlural">
                <CheckboxGroup
                    options={Object.entries(A5E.spellSchools.secondary)}
                    selected={$item.system.schools.secondary}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.schools.secondary",
                            event.detail
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.SpellComponents">
                <ul
                    class="u-flex u-flex-wrap u-gap-sm u-list-style-none u-m-0 u-p-0 u-text-xs u-w-full"
                >
                    {#each Object.entries(A5E.spellComponents) as [value, label]}
                        <Tag
                            {label}
                            {value}
                            active={$item.system.components[value]}
                            on:tagToggle={() =>
                                updateDocumentDataFromField(
                                    $item,
                                    `system.components.${value}`,
                                    !$item.system.components[value]
                                )}
                        />
                    {/each}
                </ul>
            </FormSection>

            {#if $item.system.components.material}
                <FormSection heading="A5E.SpellMaterials">
                    <div class="u-w-full">
                        <input
                            class="a5e-input"
                            type="text"
                            name="system.materials"
                            value={$item.system.materials}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.value
                                )}
                        />
                    </div>
                </FormSection>
            {/if}

            <FormSection>
                <div
                    class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
                >
                    <div class="u-align-center u-flex u-gap-md">
                        <input
                            class="u-pointer"
                            type="checkbox"
                            name="system.concentration"
                            id="{appId}-concentration"
                            checked={$item.system.concentration}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.checked
                                )}
                        />

                        <label class="u-pointer" for="{appId}-concentration">
                            {localize("A5E.SpellConcentration")}
                        </label>
                    </div>

                    <div class="u-align-center u-flex u-gap-md">
                        <input
                            class="u-pointer"
                            type="checkbox"
                            name="system.prepared"
                            id="{appId}-prepared"
                            checked={$item.system.prepared}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.checked
                                )}
                        />

                        <label class="u-pointer" for="{appId}-prepared">
                            {localize("A5E.ItemPrepared")}
                        </label>
                    </div>

                    {#if $item.system.level > 0}
                        <div class="u-align-center u-flex u-gap-md">
                            <input
                                class="u-pointer"
                                type="checkbox"
                                name="system.ritual"
                                id="{appId}-ritual"
                                checked={$item.system.ritual}
                                on:change={({ target }) =>
                                    updateDocumentDataFromField(
                                        $item,
                                        target.name,
                                        target.checked
                                    )}
                            />

                            <label class="u-pointer" for="{appId}-ritual">
                                {localize("A5E.SpellRitual")}
                            </label>
                        </div>
                    {/if}
                </div>
            </FormSection>
        </div>
    {:else}
        <FormSection>
            <dl class="summary-list">
                <div class="summary-list__item">
                    <dt class="summary-list__label">
                        {localize("A5E.SpellLevel")}:
                    </dt>
                    <dd class="summary-list__value">
                        {A5E.spellLevels[$item.system.level]}
                    </dd>
                </div>

                <div class="summary-list__item">
                    <dt class="summary-list__label">
                        {localize("A5E.SpellSchoolPrimary")}:
                    </dt>
                    <dd class="summary-list__value">
                        {A5E.spellSchools.primary[$item.system.schools.primary]}
                    </dd>
                </div>

                <div class="summary-list__item">
                    <dt class="summary-list__label">
                        {localize("A5E.SpellSchoolSecondaryPlural")}:
                    </dt>
                    <dd class="summary-list__value">
                        {#if $item.system.schools.secondary.length}
                            {localeSort(
                                $item.system.schools.secondary.map(
                                    (school) =>
                                        A5E.spellSchools.secondary[school] ??
                                        school
                                )
                            ).join(", ")}
                        {:else}
                            {localize("A5E.None")}
                        {/if}
                    </dd>
                </div>

                <hr class="a5e-rule u-my-sm" />

                <div class="summary-list__item">
                    <dt class="summary-list__label">
                        {localize("A5E.SpellComponents")}:
                    </dt>
                    <dd class="summary-list__value">
                        {#if Object.values($item.system.components).some(Boolean)}
                            {Object.entries($item.system.components)
                                .filter(([_, state]) => state)
                                .map(
                                    ([component]) =>
                                        A5E.spellComponentAbbreviations[
                                            component
                                        ] ?? component
                                )
                                .join(", ")}
                        {:else}
                            {localize("A5E.None")}
                        {/if}
                    </dd>
                </div>

                {#if $item.system.components.material && $item.system.materials}
                    <div class="summary-list__item">
                        <dt class="summary-list__label">
                            {localize("A5E.SpellMaterials")}:
                        </dt>

                        <dd class="summary-list__value">
                            {$item.system.materials}
                        </dd>
                    </div>
                {/if}
            </dl>
        </FormSection>
    {/if}
</section>

<style lang="scss">
    .summary-list {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        margin: 0;
        font-size: 0.833rem;

        &__item {
            display: flex;
            align-items: flex-start;
        }

        &__label {
            font-weight: bold;
            white-space: nowrap;
        }

        &__value {
            margin: 0;
        }
    }

    .list {
        flex-wrap: wrap;
        row-gap: 0.125rem;
    }

    .list-item {
        white-space: nowrap;
    }
</style>
