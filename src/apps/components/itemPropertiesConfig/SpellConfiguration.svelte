<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import objectEntriesNumberKeyConverter from "../../utils/objectEntriesNumberKeyConverter";

    import FormSection from "../FormSection.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const appId = getContext("appId");

    let editMode = false;

    function toggleEditMode() {
        editMode = !editMode;
    }

    const spellLevels = CONFIG.A5E.spellLevels;
    const spellSchoolPrimary = CONFIG.A5E.spellSchools.primary;
    const spellSchoolSecondary = CONFIG.A5E.spellSchools.secondary;
    const spellComponents = CONFIG.A5E.spellComponents;
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
        <h3>{localize("Spell Configuration")}</h3>
        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.SpellLevel">
                <!-- svelte-ignore missing-declaration -->
                <RadioGroup
                    options={objectEntriesNumberKeyConverter(spellLevels)}
                    selected={$item.system.level}
                    name="system.level"
                    document={item}
                />
            </FormSection>

            <FormSection heading="A5E.SpellSchoolPrimary">
                <!-- svelte-ignore missing-declaration -->
                <RadioGroup
                    options={Object.entries(spellSchoolPrimary)}
                    selected={$item.system.schools.primary}
                    name="system.schools.primary"
                    document={item}
                />
            </FormSection>

            <FormSection heading="A5E.SpellSchoolSecondaryPlural">
                <!-- svelte-ignore missing-declaration -->
                <CheckboxGroup
                    options={Object.entries(spellSchoolSecondary)}
                    selected={$item.system.schools.secondary}
                    name="system.schools.secondary"
                />
            </FormSection>

            <FormSection heading="A5E.SpellComponents">
                <ul
                    class="u-flex u-flex-wrap u-gap-sm u-list-style-none u-m-0 u-p-0 u-text-xs u-w-full"
                >
                    {#each Object.entries(spellComponents) as [value, label]}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <li
                            class="a5e-tag u-pointer"
                            class:a5e-tag--inactive={!$item.system.components[
                                value
                            ]}
                            on:click={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    `system.components.${value}`,
                                    !$item.system.components[value]
                                )}
                        >
                            {localize(label)}
                        </li>
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

                <FormSection>
                    <div
                        class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
                    >
                        <div class="u-align-center u-flex u-gap-md">
                            <input
                                class="u-pointer"
                                type="checkbox"
                                name="system.concentration"
                                id={`${appId}-concentration`}
                                checked={$item.system.concentration}
                                on:change={({ target }) =>
                                    updateDocumentDataFromField(
                                        $item,
                                        target.name,
                                        target.checked
                                    )}
                            />

                            <label
                                class="u-pointer"
                                for={`${appId}-concentration`}
                            >
                                {localize("A5E.SpellConcentration")}
                            </label>
                        </div>

                        <div class="u-align-center u-flex u-gap-md">
                            <input
                                class="u-pointer"
                                type="checkbox"
                                name="system.prepared"
                                id={`${appId}-prepared`}
                                checked={$item.system.prepared}
                                on:change={({ target }) =>
                                    updateDocumentDataFromField(
                                        $item,
                                        target.name,
                                        target.checked
                                    )}
                            />

                            <label class="u-pointer" for={`${appId}-prepared`}>
                                {localize("A5E.ItemPrepared")}
                            </label>
                        </div>

                        {#if $item.system.level > 0}
                            <div class="u-align-center u-flex u-gap-md">
                                <input
                                    class="u-pointer"
                                    type="checkbox"
                                    name="system.ritual"
                                    id={`${appId}-ritual`}
                                    checked={$item.system.ritual}
                                    on:change={({ target }) =>
                                        updateDocumentDataFromField(
                                            $item,
                                            target.name,
                                            target.checked
                                        )}
                                />

                                <label
                                    class="u-pointer"
                                    for={`${appId}-ritual`}
                                >
                                    {localize("A5E.SpellRitual")}
                                </label>
                            </div>
                        {/if}
                    </div>
                </FormSection>
            {/if}
        </div>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.SpellLevel")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {localize(spellLevels[$item.system.level])}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.SpellSchoolPrimary")}:
                </dt>
                <dd class="u-m-0 u-p-0">
                    {localize(spellSchoolPrimary[$item.system.schools.primary])}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.SpellLevel")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {#if $item.system.schools.secondary.length}
                        <ul
                            class="
              u-comma-list
              u-flex
              u-flex-shrink-0
              u-gap-ch
              u-list-style-none
              u-m-0
              u-p-0
              u-w-fit
            "
                        >
                            {#each $item.system.schools.secondary.sort( (a, b) => a
                                        .toLowerCase()
                                        .localeCompare(b.toLowerCase()) ) as school}
                                <li key={school}>
                                    {localize(
                                        spellSchoolSecondary[school] ?? school
                                    )}
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        {localize("A5E.None")}
                    {/if}
                </dd>
            </div>

            <hr class="a5e-rule u-my-sm" />

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.SpellComponents")}:</dt>
                <dd class="u-flex u-gap-ch u-m-0 u-p-0">
                    {#if Object.values($item.system.components).some(Boolean)}
                        <ul
                            class="
              u-comma-list
              u-flex
              u-flex-shrink-0
              u-gap-ch
              u-list-style-none
              u-m-0
              u-p-0
              u-w-fit
            "
                        >
                            {#each Object.entries($item.system.components).filter(([_, state]) => state) as [component, _]}
                                <li>
                                    {localize(
                                        `${spellComponents[component]}Abbr` ??
                                            component
                                    )}
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        {localize("A5E.None")}
                    {/if}
                </dd>
            </div>

            {#if $item.system.components.material && $item.system.materials}
                <div class="u-flex u-gap-md">
                    <dt class="u-flex-shrink-0 u-text-bold">
                        {localize("A5E.SpellMaterials")}:
                    </dt>

                    <dd class="u-m-0 u-p-0">
                        {$item.system.materials}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</section>
