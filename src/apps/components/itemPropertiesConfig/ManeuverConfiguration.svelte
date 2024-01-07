<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    import objectEntriesNumberKeyConverter from "../../../utils/objectEntriesNumberKeyConverter";
    import Section from "../Section.svelte";

    const item = getContext("item");
    const appId = getContext("appId");
    const { maneuverDegrees, maneuverTraditions } = CONFIG.A5E;

    let editMode = false;
</script>

<Section
    heading="A5E.TabManeuverProperties"
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
            heading="A5E.ManeuverDegreePrompt"
            options={objectEntriesNumberKeyConverter(maneuverDegrees)}
            selected={parseInt($item.system.degree, 10)}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.degree",
                    event.detail,
                )}
        />

        {#if $item.system.degree > 0}
            <RadioGroup
                heading="A5E.ManeuverTraditionPrompt"
                options={Object.entries(maneuverTraditions)}
                selected={$item.system.tradition}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.tradition",
                        event.detail,
                    )}
            />

            <FieldWrapper>
                <Checkbox
                    label="A5E.ManeuverIsStance"
                    checked={$item.system.isStance}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $item,
                            "system.isStance",
                            detail,
                        );
                    }}
                />
            </FieldWrapper>

            <FieldWrapper>
                <Checkbox
                    label="A5E.SpellConcentration"
                    checked={$item.system.concentration}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $item,
                            "system.concentration",
                            detail,
                        );
                    }}
                />
            </FieldWrapper>

            <FieldWrapper heading="A5E.ItemExertionCost">
                <div class="u-w-20">
                    <input
                        type="number"
                        data-dtype="Number"
                        name="system.exertionCost"
                        value={$item.system.exertionCost}
                        id="{appId}-exertion-cost"
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                Number(target.value),
                            )}
                    />
                </div>
            </FieldWrapper>
        {/if}
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.ManeuverDegreePrompt")}:
                </dt>

                <dd class="u-m-0 u-p-0">
                    {maneuverDegrees[$item.system.degree]}

                    {#if $item.system.degree > 0 && $item.system.isStance}
                        {localize("A5E.ManeuverStance")}
                    {/if}
                </dd>
            </div>

            {#if $item.system.degree > 0}
                <div class="u-flex u-gap-md">
                    <dt class="u-text-bold">
                        {localize("A5E.ManeuverTraditionPrompt")}:
                    </dt>

                    <dd class="u-m-0 u-p-0">
                        {maneuverTraditions[$item.system.tradition] ??
                            localize("A5E.None")}
                    </dd>
                </div>

                <div class="u-flex u-gap-md">
                    <dt class="u-text-bold">
                        {localize("A5E.ItemExertionCost")}:
                    </dt>

                    <dd class="u-m-0 u-p-0">
                        {$item.system.exertionCost || 0}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</Section>
