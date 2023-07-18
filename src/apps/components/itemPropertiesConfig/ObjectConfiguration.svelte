<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const appId = getContext("appId");
    const { A5E } = CONFIG;
    const { isGM } = game.user;

    let editMode = false;

    function toggleEditMode() {
        editMode = !editMode;
    }
</script>

<section>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
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
        <h3>{localize("A5E.TabObjectProperties")}</h3>
        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.ObjectTypePrompt">
                <RadioGroup
                    options={Object.entries(A5E.objectTypes)}
                    selected={$item.system.objectType}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.objectType",
                            event.detail
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.ItemRarity">
                <RadioGroup
                    options={Object.entries(A5E.itemRarity)}
                    selected={$item.system.rarity}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.rarity",
                            event.detail
                        )}
                />
            </FormSection>

            <FormSection --gap="0.5rem 1.25rem">
                <Checkbox
                    label="A5E.AttunementRequiredPrompt"
                    checked={$item.system.requiresAttunement}
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.requiresAttunement",
                            detail
                        )}
                />

                {#if $item.actor && $item.system.requiresAttunement}
                    <Checkbox
                        label="A5E.AttunementPrompt"
                        checked={$item.system.attuned}
                        on:updateSelection={({ detail }) =>
                            updateDocumentDataFromField(
                                $item,
                                "system.attuned",
                                detail
                            )}
                    />
                {/if}
                {#if isGM}
                    <Checkbox
                        label="A5E.PlotItem"
                        checked={$item.system.plotItem}
                        on:updateSelection={({ detail }) =>
                            updateDocumentDataFromField(
                                $item,
                                "system.plotItem",
                                detail
                            )}
                    />

                    <Checkbox
                        label="A5E.ItemUnidentified"
                        checked={$item.system.unidentified}
                        on:updateSelection={({ detail }) =>
                            updateDocumentDataFromField(
                                $item,
                                "system.unidentified",
                                detail
                            )}
                    />
                {/if}
            </FormSection>

            <FormSection
                heading="A5E.ItemWeight"
                --label-width="100%"
                --gap="0.375rem 1.25rem"
            >
                <div class="u-align-center u-flex u-gap-md u-w-30">
                    <input
                        type="number"
                        data-dtype="Number"
                        name="system.weight"
                        id="{appId}-weight"
                        value={$item.system.weight}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                Number(target.value)
                            )}
                    />

                    <label class="u-pointer" for="{appId}-weight">
                        {localize("A5E.DetailsWeightLbs")}
                    </label>
                </div>

                <Checkbox
                    label="A5E.ItemBulky"
                    checked={$item.system.bulky}
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.bulky",
                            detail
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.ItemEquippedState" --label-width="100%">
                <RadioGroup
                    options={Object.entries(A5E.equippedStates)}
                    selected={$item.system.equippedState}
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.equippedState",
                            detail
                        )}
                />
            </FormSection>

            <FormSection heading="A5E.ItemQuantity">
                <div
                    class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
                >
                    <div class="u-w-20">
                        <input
                            type="number"
                            data-dtype="Number"
                            min="0"
                            max="9999"
                            name="system.quantity"
                            id={`${appId}-quantity`}
                            value={$item.system.quantity}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    Number(target.value)
                                )}
                        />
                    </div>
                </div>
            </FormSection>

            <FormSection heading="A5E.ItemPrice">
                <div
                    class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
                >
                    <div class="u-align-center u-flex u-gap-md u-w-30">
                        <input
                            class="u-pl-lg"
                            type="text"
                            name="system.price"
                            id={`${appId}-price`}
                            value={$item.system.price}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.value
                                )}
                        />
                    </div>
                </div>
            </FormSection>

            <FormSection heading="A5E.CraftingComponents">
                <div
                    class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
                >
                    <div class="u-align-center u-flex u-gap-md u-w-full">
                        <input
                            class="u-pl-lg"
                            type="text"
                            name="system.craftingComponents"
                            value={$item.system.craftingComponents}
                            id={`${appId}-craftingComponents`}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.value
                                )}
                        />
                    </div>
                </div>
            </FormSection>

            <FormSection heading="A5E.ItemCondition" --direction="column">
                <RadioGroup
                    options={Object.entries(A5E.damagedStates)}
                    selected={$item.system.damagedState}
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.damagedState",
                            Number(detail)
                        )}
                />
            </FormSection>
        </div>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ObjectTypePrompt")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {A5E.objectTypes[$item.system.objectType] ??
                        localize("A5E.None")}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ItemRarity")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {localize(
                        A5E.itemRarity[$item.system.rarity] ??
                            $item.system.rarity
                    )}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.Attunement")}:</dt>
                <dd class="align-center u-flex u-gap-sm u-m-0 u-p-0">
                    {#if $item.system.requiresAttunement}
                        {localize("A5E.AttunementRequired")}

                        ({localize(
                            $item.system.attuned
                                ? "A5E.Attuned"
                                : "A5E.AttunedNot"
                        )})
                    {:else}
                        {localize("A5E.AttunementNotRequired")}
                    {/if}
                </dd>
            </div>

            <hr class="a5e-rule u-my-sm" />

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ItemWeight")}:</dt>
                <dd class="align-center u-flex u-gap-sm u-m-0 u-p-0">
                    {$item.system.weight}
                    {localize("A5E.DetailsWeightLbs")}

                    {#if $item.system.bulky}
                        ({localize("A5E.ItemBulky")})
                    {/if}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ItemQuantity")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {$item.system.quantity || 0}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ItemPrice")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {$item.system.price ?? localize("A5E.None")}
                </dd>
            </div>
            {#if $item.system.craftingComponents != ""}
                <div class="u-flex u-gap-md">
                    <dt class="u-text-bold">
                        {localize("A5E.CraftingComponents")}:
                    </dt>
                    <dd class="u-m-0 u-p-0">
                        {$item.system.craftingComponents ??
                            localize("A5E.None")}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</section>
