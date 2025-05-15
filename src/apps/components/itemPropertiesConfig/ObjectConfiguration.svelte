<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/util/i18n";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const appId = getContext("appId");
    const { A5E } = CONFIG;
    const { isGM } = game.user;

    let editMode = false;
    let hideBrokenAndDamaged = game.settings.get("a5e", "hideBrokenAndDamaged");
    let showVRCTechLevel = game.settings.get("a5e", "showVRCTechLevel");
    let showVRCImplants = game.settings.get("a5e", "showVRCImplants");
</script>

<Section
    heading="A5E.tabs.objectProperties"
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
        <RadioGroup
            heading="A5E.objects.typePrompt"
            options={Object.entries(A5E.objectTypes)}
            selected={$item.system.objectType}
            on:updateSelection={(event) =>
                updateDocumentDataFromField($item, "system.objectType", event.detail)}
        />

        <RadioGroup
            heading="A5E.objects.rarity"
            options={Object.entries(A5E.itemRarity)}
            selected={$item.system.rarity}
            on:updateSelection={(event) =>
                updateDocumentDataFromField($item, "system.rarity", event.detail)}
        />

        {#if showVRCTechLevel}
            <RadioGroup
                heading="A5E.objects.technologyLevel"
                options={Object.entries(A5E.itemTechLevels)}
                selected={$item.system.techLevel}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField($item, "system.techLevel", event.detail)}
            />
        {/if}

        <Section --a5e-section-body-direction="row" --a5e-section-body-gap="0.75rem">
            <Checkbox
                label="A5E.attument.headings.requiredPrompt"
                checked={$item.system.requiresAttunement}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.requiresAttunement",
                        detail,
                    )}
            />

            {#if $item.actor && $item.system.requiresAttunement}
                <Checkbox
                    label="A5E.attument.headings.prompt"
                    checked={$item.system.attuned}
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField($item, "system.attuned", detail)}
                />
            {/if}

            {#if isGM}
                <Checkbox
                    label="A5E.objects.plotItem"
                    checked={$item.system.plotItem}
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField($item, "system.plotItem", detail)}
                />

                <Checkbox
                    label="A5E.objects.unidentified"
                    checked={$item.system.unidentified}
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField($item, "system.unidentified", detail)}
                />
            {/if}

            {#if $item.system.objectType == "consumable"}
                <Checkbox
                    label="A5E.supply.title"
                    checked={$item.system.supply}
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField($item, "system.supply", detail)}
                />
            {/if}

            {#if showVRCImplants}
                <Checkbox
                    label="A5E.objects.implant"
                    checked={$item.system.implant}
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField($item, "system.implant", detail)}
                />
            {/if}
        </Section>

        {#if $item.system.requiresAttunement}
            <FieldWrapper heading="A5E.attument.headings.hint">
                <input
                    class="u-pl-lg"
                    type="text"
                    name="system.attunementHint"
                    value={$item.system.attunementHint}
                    id={`${appId}-attunementHint`}
                    on:change={({ target }) =>
                        updateDocumentDataFromField($item, target.name, target.value)}
                />
            </FieldWrapper>
        {/if}

        <FieldWrapper
            heading="A5E.objects.weight"
            --a5e-field-wrapper-gap="0.375rem 1rem"
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-header-width="100%"
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
                            Number(target.value),
                        )}
                />

                <span>{localize("A5E.objects.weightLbs")}</span>
            </div>

            <Checkbox
                label="A5E.objects.bulky"
                checked={$item.system.bulky}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField($item, "system.bulky", detail)}
            />
        </FieldWrapper>

        <RadioGroup
            heading="A5E.objects.equippedState"
            options={Object.entries(A5E.equippedStates)}
            selected={$item.system.equippedState}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.equippedState",
                    parseInt(detail, 10),
                )}
        />

        <FieldWrapper heading="A5E.ItemQuantity">
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
                            Number(target.value),
                        )}
                />
            </div>
        </FieldWrapper>

        <FieldWrapper heading="A5E.objects.price">
            <div class="u-align-center u-flex u-gap-md u-w-30">
                <input
                    class="u-pl-lg"
                    type="text"
                    name="system.price"
                    id={`${appId}-price`}
                    value={$item.system.price}
                    on:change={({ target }) =>
                        updateDocumentDataFromField($item, target.name, target.value)}
                />
            </div>
        </FieldWrapper>

        <FieldWrapper heading="A5E.objects.craftingComponents">
            <input
                class="u-pl-lg"
                type="text"
                name="system.craftingComponents"
                value={$item.system.craftingComponents}
                id={`${appId}-craftingComponents`}
                on:change={({ target }) =>
                    updateDocumentDataFromField($item, target.name, target.value)}
            />
        </FieldWrapper>

        {#if !hideBrokenAndDamaged}
            <RadioGroup
                heading="A5E.objects.condition"
                options={Object.entries(A5E.damagedStates)}
                selected={$item.system.damagedState}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.damagedState",
                        parseInt(detail, 10),
                    )}
            />
        {/if}
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.objects.typePrompt")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {A5E.objectTypes[$item.system.objectType] ?? localize("A5E.None")}
                </dd>
            </div>

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.objects.rarity")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {localize(A5E.itemRarity[$item.system.rarity] ?? $item.system.rarity)}
                </dd>
            </div>

            {#if showVRCTechLevel}
                <div class="u-flex u-gap-md">
                    <dt class="u-text-bold">{localize("A5E.objects.technologyLevel")}:</dt>
                    <dd class="u-m-0 u-p-0">
                        {localize(
                            A5E.itemTechLevels[$item.system.techLevel] ??
                                $item.system.techLevel,
                        )}
                    </dd>
                </div>
            {/if}

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.attument.headings.attunement")}:</dt>
                <dd class="align-center u-flex u-gap-sm u-m-0 u-p-0">
                    {#if $item.system.requiresAttunement}
                        {localize("A5E.attument.headings.required")}

                        ({localize(
                            $item.system.attuned ? "A5E.attument.headings.attuned" : "A5E.attument.headings.not",
                        )})
                    {:else}
                        {localize("A5E.attument.headings.notRequired")}
                    {/if}
                </dd>
            </div>

            {#if $item.system.attunementHint !== ""}
                <div class="u-flex u-gap-md">
                    <dt class="u-text-bold">{localize("A5E.attument.headings.hint")}:</dt>
                    <dd class="u-m-0 u-p-0">
                        {$item.system.attunementHint}
                    </dd>
                </div>
            {/if}

            <hr class="a5e-rule u-my-sm" />

            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.objects.weight")}:</dt>
                <dd class="align-center u-flex u-gap-sm u-m-0 u-p-0">
                    {$item.system.weight}
                    {localize("A5E.objects.weightLbs")}

                    {#if $item.system.bulky}
                        ({localize("A5E.objects.bulky")})
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
                <dt class="u-text-bold">{localize("A5E.objects.price")}:</dt>
                <dd class="u-m-0 u-p-0">
                    {$item.system.price ?? localize("A5E.None")}
                </dd>
            </div>
            {#if $item.system.craftingComponents != ""}
                <div class="u-flex u-gap-md">
                    <dt class="u-text-bold">
                        {localize("A5E.objects.craftingComponents")}:
                    </dt>
                    <dd class="u-m-0 u-p-0">
                        {$item.system.craftingComponents ?? localize("A5E.None")}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</Section>
