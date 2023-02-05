<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const item = getContext("item");

    let editMode = false;

    function toggleEditMode() {
        editMode = !editMode;
    }

    const recoveryOptions = CONFIG.A5E.resourceRecoveryOptions;
    $: hasUses = $item.system.uses.value || $item.system.uses.max;
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
        <h3>{localize("Resource Consumption")}</h3>
        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.Uses">
                <div class="u-flex u-gap-lg u-w-full">
                    <div class="u-flex u-flex-col u-gap-xs u-w-30">
                        <h3 class="u-text-sm">{localize("A5E.UsesCurrent")}</h3>

                        <input
                            class="a5e-input"
                            type="number"
                            d-type="Number"
                            name="system.uses.value"
                            value={$item.system.uses.value}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    Number(target.value)
                                )}
                        />
                    </div>

                    <div class="u-flex u-flex-col u-gap-xs u-w-30">
                        <h3 class="u-text-sm">{localize("A5E.UsesMax")}</h3>

                        <input
                            class="a5e-input"
                            type="number"
                            d-type="Number"
                            name="system.uses.max"
                            value={$item.system.uses.max}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    Number(target.value)
                                )}
                        />
                    </div>

                    <div class="u-flex u-flex-col u-gap-xs u-w-fit">
                        <h3 class="u-text-sm">{localize("A5E.UsesPer")}</h3>
                        <select
                            class="u-h-8 u-w-40"
                            name="system.uses.per"
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    target.name,
                                    target.value
                                )}
                        >
                            <option value="" />

                            {#each Object.entries(recoveryOptions) as [key, name]}
                                <option
                                    {key}
                                    value={key}
                                    selected={$item.system.uses.per === key}
                                >
                                    {localize(name)}
                                </option>
                            {/each}
                        </select>
                    </div>
                </div>
            </FormSection>
        </div>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <dt class="u-text-bold">{localize("A5E.Uses")}:</dt>
            <dd class="align-center u-flex u-gap-sm u-m-0 u-p-0">
                {#if hasUses}
                    <div class="u-flex u-gap-md">
                        <span>
                            {$item.system.uses.value || 0}
                        </span>

                        {#if $item.system.uses.max}
                            <span>/</span>
                            <span>{$item.system.uses.max}</span>
                        {/if}

                        {#if $item.system.uses.per}
                            <span>
                                ( Per {localize(
                                    recoveryOptions[$item.system.uses.per]
                                )} )
                            </span>
                        {/if}
                    </div>
                {:else}
                    {localize("A5E.None")}
                {/if}
            </dd>
        </dl>
    {/if}
</section>
