<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";
    import { NodePackageImporter } from "sass";

    function prepareWeaponProperties(item) {
        const properties = item.system.weaponProperties
            .map((property) => {
                switch (property) {
                    case "defensive":
                        if (item.system.defensiveProperties) {
                            const dp =
                                defensiveProperties[
                                    item.system.defensiveProperties
                                ];

                            return localize(
                                "A5E.weaponProperties.defensiveSpecific",
                                { type: dp },
                            );
                        }

                        return weaponProperties["defensive"];
                    case "breaker":
                        const bp = item.system.breakerProperties
                            ?.map((p) => breakerProperties[p] ?? null)
                            ?.filter(Boolean);

                        if (bp.length) {
                            return localize(
                                "A5E.weaponProperties.breakerSpecific",
                                { type: bp.join(", ") },
                            );
                        }

                        return weaponProperties["breaker"];
                    case "versatile":
                        if (item.system.versatile) {
                            const versatile =
                                versatileOptions[item.system.versatile];

                            return localize(
                                "A5E.weaponProperties.versatileSpecific",
                                { die: versatile },
                            );
                        }

                        return weaponProperties["versatile"];
                    default:
                        return weaponProperties[property] ?? null;
                }
            })
            .filter(Boolean);

        properties.sort((a, b) => a.localeCompare(b));

        return properties.join(", ");
    }

    const item = getContext("item");
    const {
        breakerProperties,
        defensiveProperties,
        versatileOptions,
        weaponProperties,
    } = CONFIG.A5E;

    let editMode = false;

    $: selectedWeaponProperties = prepareWeaponProperties($item);
</script>

<Section
    heading="A5E.TabWeaponProperties"
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
        <CheckboxGroup
            heading="A5E.WeaponProperties"
            options={Object.entries(weaponProperties)}
            selected={$item.system.weaponProperties}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.weaponProperties",
                    event.detail,
                )}
        />

        {#if $item.system.weaponProperties.includes("breaker")}
            <CheckboxGroup
                heading="Breaker Property"
                options={Object.entries(breakerProperties)}
                selected={$item.system.breakerProperties}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.breakerProperties",
                        event.detail,
                    )}
            />
        {/if}

        {#if $item.system.weaponProperties.includes("defensive")}
            <RadioGroup
                heading="Defensive Property"
                options={Object.entries(defensiveProperties)}
                selected={$item.system.defensiveProperties}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.defensiveProperties",
                        event.detail,
                    )}
            />
        {/if}

        {#if $item.system.weaponProperties.includes("versatile")}
            <RadioGroup
                heading="Defensive Property"
                options={Object.entries(versatileOptions)}
                selected={$item.system.versatile}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.versatile",
                        event.detail,
                    )}
            />
        {/if}
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">{localize("A5E.WeaponProperties")}:</dt>

                <dd class="u-m-0 u-p-0">
                    {selectedWeaponProperties || localize("A5E.None")}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
