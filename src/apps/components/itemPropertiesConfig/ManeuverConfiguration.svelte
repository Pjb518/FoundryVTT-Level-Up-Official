<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";
    import objectEntriesNumberKeyConverter from "../../utils/objectEntriesNumberKeyConverter";

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
        <h3>{localize("A5E.TabManeuverProperties")}</h3>
        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.ManeuverDegreePrompt">
                <RadioGroup
                    options={objectEntriesNumberKeyConverter(
                        A5E.maneuverDegrees
                    )}
                    selected={parseInt($item.system.degree, 10)}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.degree",
                            event.detail
                        )}
                />
            </FormSection>

            {#if $item.system.degree > 0}
                <FormSection heading="A5E.ManeuverTraditionPrompt">
                    <RadioGroup
                        options={Object.entries(A5E.maneuverTraditions)}
                        selected={$item.system.tradition}
                        on:updateSelection={(event) =>
                            updateDocumentDataFromField(
                                $item,
                                "system.tradition",
                                event.detail
                            )}
                    />
                </FormSection>

                <FormSection>
                    <div class="u-align-center u-flex u-gap-md">
                        <input
                            class="u-pointer"
                            type="checkbox"
                            name="system.isStance"
                            id="{appId}-isStance"
                            checked={$item.system.isStance}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.checked
                                )}
                        />

                        <label class="u-pointer" for="{appId}-isStance">
                            {localize("A5E.ManeuverIsStance")}
                        </label>
                    </div>
                </FormSection>

                <FormSection>
                    <div
                        class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
                    >
                        <label
                            class="u-text-bold u-w-full"
                            for="{appId}-exertion-cost"
                        >
                            {localize("A5E.ItemExertionCost")}
                        </label>

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
                                        Number(target.value)
                                    )}
                            />
                        </div>
                    </div>
                </FormSection>
            {/if}
        </div>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.ManeuverDegreePrompt")}:
                </dt>

                <dd class="u-m-0 u-p-0">
                    {A5E.maneuverDegrees[$item.system.degree]}

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
                        {A5E.maneuverTraditions[$item.system.tradition] ??
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
</section>
