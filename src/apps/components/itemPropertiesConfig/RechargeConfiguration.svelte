<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import getDeterministicBonus from "../../../dice/getDeterministicBonus";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";

    const item = getContext("item");

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
        <h3>{localize("A5E.ItemRechargeConfiguration")}</h3>
        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection>
                <div class="u-flex u-gap-md u-w-full">
                    <div class="u-flex u-flex-col u-gap-md u-w-full">
                        <label for="{$item.id}-recharge-formula">
                            {localize("A5E.ItemRechargeFormula")}
                        </label>

                        <input
                            id="{$item.id}-recharge-formula"
                            type="text"
                            value={$item.system.recharge.formula ?? ""}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    `system.recharge.formula`,
                                    target.value
                                )}
                        />
                    </div>

                    <div class="u-flex u-flex-col u-gap-md u-w-30">
                        <label for="{$item.id}-recharge-threshold">
                            {localize("A5E.ItemRechargeThreshold")}
                        </label>

                        <input
                            id="{$item.id}-recharge-threshold"
                            class="u-text-center"
                            type="number"
                            value={$item.system.recharge.threshold ?? 0}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    `system.recharge.threshold`,
                                    Number(target.value)
                                )}
                        />
                    </div>
                </div>
            </FormSection>
        </div>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <dt class="u-text-bold">{localize("A5E.ItemRecharge")}:</dt>
            <dd class="align-center u-flex u-gap-sm u-m-0 u-p-0">
                {#if $item.system.recharge.formula}
                    <div class="u-flex u-gap-md">
                        <span>
                            {$item.system.recharge.formula}
                        </span>

                        ( Recharges on:

                        <span>
                            {$item.system.recharge.threshold
                                ? `${$item.system.recharge.threshold}`
                                : "6"} )
                        </span>
                    </div>
                {:else}
                    {localize("A5E.None")}
                {/if}
            </dd>
        </dl>
    {/if}
</section>
