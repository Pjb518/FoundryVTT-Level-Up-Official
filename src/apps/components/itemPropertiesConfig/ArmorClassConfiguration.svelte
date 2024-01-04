<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../LegacyFormSection.svelte";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const appId = getContext("appId");
    const { armorModes } = CONFIG.A5E;

    const modes = [
        ["Add", CONFIG.A5E.ARMOR_MODES.ADD],
        ["Override", CONFIG.A5E.ARMOR_MODES.OVERRIDE],
    ];

    let editMode = false;
</script>

<section>
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
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
        on:click={() => (editMode = !editMode)}
    >
        <h3>{localize("A5E.TabArmorClassProperties")}</h3>
        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection
                heading="A5E.armorClass.formula"
                --label-width="100%"
                --gap="0.375rem 1.25rem"
            >
                <input
                    type="text"
                    name="system.ac.baseFormula"
                    id="{appId}-ac-base-formula"
                    value={$item.system.ac.baseFormula ?? ""}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            target.name,
                            target.value,
                        )}
                />
            </FormSection>

            <FormSection --gap="0.375rem 1.25rem">
                <div class="u-flex u-flex-col u-gap-md u-w-30">
                    <label
                        class="u-pointer u-text-bold"
                        for="{appId}-ac-max-dex"
                    >
                        {localize("A5E.armorClass.maxDex")}
                    </label>

                    <input
                        type="number"
                        data-dtype="Number"
                        name="system.ac.maxDex"
                        id="{appId}-ac-max-dex"
                        value={$item.system.ac.maxDex ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                Number(target.value),
                            )}
                    />
                </div>

                <div class="u-flex u-flex-col u-gap-md u-w-30">
                    <label
                        class="u-pointer u-text-bold"
                        for="{appId}-ac-min-str"
                    >
                        {localize("A5E.armorClass.minStr")}
                    </label>

                    <input
                        type="number"
                        data-dtype="Number"
                        name="system.ac.minStr"
                        id="{appId}-ac-min-str"
                        value={$item.system.ac.minStr ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                Number(target.value),
                            )}
                    />
                </div>

                <div class="u-flex u-flex-col u-gap-md u-w-30">
                    <label class="u-pointer u-text-bold" for="{appId}-ac-mode">
                        {localize("A5E.armorClass.mode")}
                    </label>

                    <select
                        name="system.ac.mode"
                        id="{appId}-ac-mode"
                        value={$item.system.ac.mode}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                Number(target.value),
                            )}
                    >
                        {#each modes as [label, mode]}
                            <option value={mode}>
                                {label}
                            </option>
                        {/each}
                    </select>
                </div>
            </FormSection>

            {#if !["armor", "shield"].includes($item.system?.objectType)}
                <FormSection --gap="0.5rem 1.25rem">
                    <Checkbox
                        label="A5E.armorClass.requiresNoShield"
                        checked={$item.system.ac.requiresNoShield ?? false}
                        on:updateSelection={({ detail }) =>
                            updateDocumentDataFromField(
                                $item,
                                "system.ac.requiresNoShield",
                                detail,
                            )}
                    />
                </FormSection>

                <FormSection --gap="0.5rem 1.25rem">
                    <Checkbox
                        label="A5E.armorClass.requiresUnarmored"
                        checked={$item.system.ac.requiresUnarmored ?? false}
                        on:updateSelection={({ detail }) =>
                            updateDocumentDataFromField(
                                $item,
                                "system.ac.requiresUnarmored",
                                detail,
                            )}
                    />
                </FormSection>
            {/if}
        </div>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.armorClass.formula")}:
                </dt>

                <dd class="u-m-0 u-p-0">
                    {$item.system.ac.formula ?? ""}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.armorClass.maxDex")}:
                </dt>

                <dd class="u-m-0 u-p-0">
                    {$item.system.ac.maxDex ?? 0}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.armorClass.minStr")}:
                </dt>

                <dd class="u-m-0 u-p-0">
                    {$item.system.ac.minStr ?? 0}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.armorClass.mode")}:
                </dt>

                <dd class="u-m-0 u-p-0">
                    {armorModes[$item.system.ac.mode]}
                </dd>
            </div>

            {#if !["armor", "shield"].includes($item.system?.objectType)}
                <div class="u-flex u-gap-md">
                    <dt class="u-text-bold">
                        {localize("A5E.armorClass.requiresNoShield")}:
                    </dt>

                    <dd class="u-m-0 u-p-0">
                        {$item.system.ac.requiresNoShield ?? false}
                    </dd>
                </div>

                <div class="u-flex u-gap-md">
                    <dt class="u-text-bold">
                        {localize("A5E.armorClass.requiresUnarmored")}:
                    </dt>

                    <dd class="u-m-0 u-p-0">
                        {$item.system.ac.requiresUnarmored ?? false}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</section>
