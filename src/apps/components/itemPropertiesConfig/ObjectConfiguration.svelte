<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const appId = getContext("appId");

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
        <h3>Object Properties</h3>
        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.ObjectTypePrompt">
                <!-- svelte-ignore missing-declaration -->
                <RadioGroup
                    options={Object.entries(CONFIG.A5E.objectTypes)}
                    selected={$item.system.objectType}
                    name="system.objectType"
                    document={item}
                />
            </FormSection>

            <FormSection heading="A5E.ItemRarity">
                <!-- svelte-ignore missing-declaration -->
                <RadioGroup
                    options={Object.entries(CONFIG.A5E.itemRarity)}
                    selected={$item.system.rarity}
                    name="system.rarity"
                    document={item}
                />
            </FormSection>

            <FormSection>
                <div class="u-flex u-gap-xxxl u-text-sm u-w-full">
                    <div class="u-align-center u-flex u-gap-md">
                        <input
                            class="u-pointer"
                            type="checkbox"
                            name="system.requiresAttunement"
                            id={`${appId}-attunement-required`}
                            checked={$item.system.requiresAttunement}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.checked
                                )}
                        />

                        <label
                            class="u-pointer"
                            for={`${appId}-attunement-required`}
                        >
                            {localize("A5E.AttunementRequiredPrompt")}
                        </label>
                    </div>

                    {#if $item.system.requiresAttunement}
                        <div class="u-align-center u-flex u-gap-md">
                            <input
                                class="u-pointer"
                                type="checkbox"
                                name="system.attuned"
                                id={`${appId}-attuned`}
                                checked={$item.system.attuned}
                                on:change={({ target }) =>
                                    updateDocumentDataFromField(
                                        $item,
                                        target.name,
                                        target.checked
                                    )}
                            />

                            <label class="u-pointer" for={`${appId}-attuned`}>
                                {localize("A5E.AttunementPrompt")}
                            </label>
                        </div>
                    {/if}

                    <div class="u-align-center u-flex u-gap-md">
                        <input
                            class="u-pointer"
                            type="checkbox"
                            name="system.plotItem"
                            id={`${appId}-plot-item`}
                            checked={$item.system.plotItem}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.checked
                                )}
                        />

                        <label class="u-pointer" for={`${appId}-plot-item`}>
                            {localize("A5E.PlotItem")}
                        </label>
                    </div>
                </div>
            </FormSection>

            <FormSection heading="A5E.ItemWeight">
                <div
                    class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
                >
                    <div class="align-center u-flex u-gap-xxl">
                        <div class="u-align-center u-flex u-gap-md u-w-30">
                            <input
                                type="number"
                                data-dtype="Number"
                                name="system.weight"
                                id={`${appId}-weight`}
                                value={$item.system.weight}
                                on:change={({ target }) =>
                                    updateDocumentDataFromField(
                                        $item,
                                        target.name,
                                        Number(target.value)
                                    )}
                            />

                            <!-- TODO: Localize this -->
                            <label class="u-pointer" for={`${appId}-weight`}>
                                {localize("lbs.")}
                            </label>
                        </div>

                        <div class="u-align-center u-flex u-gap-md">
                            <input
                                class="u-pointer"
                                type="checkbox"
                                name="system.bulky"
                                id={`${appId}-bulky`}
                                checked={$item.system.bulky}
                                on:change={({ target }) =>
                                    updateDocumentDataFromField(
                                        $item,
                                        target.name,
                                        target.checked
                                    )}
                            />

                            <label class="u-pointer" for={`${appId}-bulky`}>
                                {localize("A5E.ItemBulky")}
                            </label>
                        </div>

                        <div class="u-align-center u-flex u-gap-md">
                            <input
                                class="u-pointer"
                                type="checkbox"
                                name="system.equipped"
                                id={`${appId}-equipped`}
                                checked={$item.system.equipped}
                            />

                            <label class="u-pointer" for={`${appId}-equipped`}>
                                {localize("A5E.ItemEquipped")}
                            </label>
                        </div>
                    </div>
                </div>
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

            <FormSection heading="A5E.ItemCondition">
                <div
                    class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
                >
                    <div class="u-align-center u-flex u-gap-md u-w-30">
                        <input
                            class="u-pointer"
                            type="checkbox"
                            name="system.broken"
                            id={`${appId}-broken`}
                            checked={$item.system.broken}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.checked
                                )}
                        />

                        <label class="u-pointer" for={`${appId}-broken`}>
                            {localize("A5E.ItemBroken")}
                        </label>
                    </div>
                </div>
            </FormSection>
        </div>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ObjectTypePrompt")}:</dt>
                <!-- svelte-ignore missing-declaration -->
                <dd class="u-m-0 u-p-0">
                    {localize(
                        CONFIG.A5E.objectTypes[$item.system.objectType] ??
                            "A5E.None"
                    )}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.ItemRarity")}:</dt>
                <!-- svelte-ignore missing-declaration -->
                <dd class="u-m-0 u-p-0">
                    {localize(
                        CONFIG.A5E.itemRarity[$item.system.rarity] ??
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
                    <!-- TODO: Reflect lbs here -->

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
                    {$item.system.price || 0}
                    <!-- TODO: Reflect currency type here -->
                </dd>
            </div>
        </dl>
    {/if}
</section>
