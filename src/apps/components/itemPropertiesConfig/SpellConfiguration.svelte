<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import localeSort from "../../utils/localeSort";
    import objectEntriesNumberKeyConverter from "../../utils/objectEntriesNumberKeyConverter";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

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
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.SpellLevel")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {A5E.spellLevels[$item.system.level]}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.SpellSchoolPrimary")}:
                </dt>
                <dd class="u-m-0 u-p-0">
                    {A5E.spellSchools.primary[$item.system.schools.primary]}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.SpellSchoolSecondaryPlural")}:
                </dt>
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
                            {#each localeSort($item.system.schools.secondary) as school}
                                <li key={school}>
                                    {A5E.spellSchools.secondary[school] ??
                                        school}
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
                                    {A5E.spellComponentAbbreviations[
                                        component
                                    ] ?? component}
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
