<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

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

<Section
    heading="A5E.TabArmorClassProperties"
    headerButtons={[
        {
            classes: `fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <FieldWrapper heading="A5E.armorClass.formula">
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
        </FieldWrapper>

        <Section --a5e-section-body-direction="row">
            <FieldWrapper heading="A5E.armorClass.maxDex">
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
            </FieldWrapper>

            <FieldWrapper heading="A5E.armorClass.minStr">
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
            </FieldWrapper>

            <FieldWrapper heading="A5E.armorClass.mode">
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
            </FieldWrapper>
        </Section>

        {#if $item.system?.objectType === "armor"}
            <FieldWrapper>
                <Checkbox
                    label="A5E.armorClass.grantsDisadvantage"
                    checked={$item.system.ac.grantsDisadvantage ?? false}
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.ac.grantsDisadvantage",
                            detail,
                        )}
                />
            </FieldWrapper>
        {/if}

        {#if !["armor", "shield"].includes($item.system?.objectType)}
            <FieldWrapper>
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
            </FieldWrapper>

            <FieldWrapper>
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
            </FieldWrapper>
        {/if}
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
</Section>
