<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FormSection from "../components/FormSection.svelte";
    import Checkbox from "../components/Checkbox.svelte";

    // export let reload;

    const appId = getContext("appId");
    const settings = getContext("settings");
    const updates = getContext("updates");

    // Stores
    let trackCurrency = settings.getStore("currencyWeight");
    let randomHP = settings.getStore("randomizeNPCHitPoints");

    let hideActionList = settings.getStore("collapseActionList");
    let hideDeleteDialog = settings.getStore("hideDeleteConfirmation");
    let rightClickConfig = settings.getStore("itemRightClickConfigure");
    let reverseAlt = settings.getStore("reverseAltBehavior");
    let reverseInitAlt = settings.getStore("reverseInitiativeAltBehavior");
</script>

<section
    class="u-flex-grow u-flex u-flex-col u-overflow-y-auto u-gap-md u-px-md u-mt-xl"
>
    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">
                {localize("A5E.settings.sectionHeader.actorBehavior")}
            </h3>
        </header>

        <FormSection
            hint="A5E.settings.hints.trackCurrencyWeight"
            --gap="0.25rem"
        >
            <Checkbox
                label="A5E.settings.trackCurrencyWeight"
                checked={updates.get("currencyWeight") ??
                    $trackCurrency ??
                    false}
                on:updateSelection={({ detail }) => {
                    updates.set("currencyWeight", detail);
                }}
            />
        </FormSection>

        <FormSection
            hint="A5E.settings.hints.randomizeNPCHitPoints"
            --gap="0.25rem"
        >
            <Checkbox
                label="A5E.settings.randomizeNPCHitPoints"
                checked={updates.get("randomizeNPCHitPoints") ??
                    $randomHP ??
                    false}
                on:updateSelection={({ detail }) => {
                    updates.set("randomizeNPCHitPoints", detail);
                }}
            />
        </FormSection>
    </section>

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">
                {localize("A5E.settings.sectionHeader.sheetSettings")}
            </h3>
        </header>

        <FormSection
            hint="A5E.settings.hints.collapseActionList"
            --gap="0.25rem"
        >
            <Checkbox
                label="A5E.settings.collapseActionList"
                checked={updates.get("collapseActionList") ??
                    $hideActionList ??
                    false}
                on:updateSelection={({ detail }) =>
                    updates.set("collapseActionList", detail)}
            />
        </FormSection>

        <FormSection
            hint="A5E.settings.hints.hideDeletionConfirmationDialog"
            --gap="0.25rem"
        >
            <Checkbox
                label="A5E.settings.hideDeletionConfirmationDialog"
                checked={updates.get("hideDeleteConfirmation") ??
                    $hideDeleteDialog ??
                    false}
                on:updateSelection={({ detail }) =>
                    updates.set("hideDeleteConfirmation", detail)}
            />
        </FormSection>

        <FormSection
            hint="A5E.settings.hints.itemRightClickConfigure"
            --gap="0.25rem"
        >
            <Checkbox
                label="A5E.settings.itemRightClickConfigure"
                checked={updates.get("itemRightClickConfigure") ??
                    $rightClickConfig ??
                    false}
                on:updateSelection={({ detail }) =>
                    updates.set("itemRightClickConfigure", detail)}
            />
        </FormSection>

        <FormSection
            hint="A5E.settings.hints.reverseAltBehavior"
            --gap="0.25rem"
        >
            <Checkbox
                label="A5E.settings.reverseAltBehavior"
                checked={updates.get("reverseAltBehavior") ??
                    $reverseAlt ??
                    false}
                on:updateSelection={({ detail }) =>
                    updates.set("reverseAltBehavior", detail)}
            />
        </FormSection>

        <FormSection
            hint="A5E.settings.hints.reverseInitiativeAltBehavior"
            --gap="0.25rem"
        >
            <Checkbox
                label="A5E.settings.reverseInitiativeAltBehavior"
                checked={updates.get("reverseInitiativeAltBehavior") ??
                    $reverseInitAlt ??
                    false}
                on:updateSelection={({ detail }) =>
                    updates.set("reverseInitiativeAltBehavior", detail)}
            />
        </FormSection>
    </section>
</section>

<style lang="scss">
    .setting-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        &:not(:last-child) {
            margin-bottom: 0.25rem;
        }
    }

    .setting-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.5rem 0.25rem 0.125rem;
        border-bottom: 1px solid #ccc;
    }

    // .setting-header-button {
    //     width: fit-content;
    //     padding: 0;
    //     margin: 0;
    //     background: transparent;
    //     line-height: 1;
    //     font-size: 0.833rem;
    //     color: #7e7960;

    //     transition: all 0.15s ease-in-out;

    //     &:focus,
    //     &:hover {
    //         box-shadow: none;
    //         color: rgb(25, 24, 19);
    //     }
    // }

    .setting-heading {
        font-size: 0.833rem;
        white-space: nowrap;
    }
</style>
