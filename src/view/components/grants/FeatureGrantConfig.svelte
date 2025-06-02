<script lang="ts">
    import { setContext } from "svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import GrantConfig from "./GrantConfig.svelte";

    import DropArea from "#view/snippets/DropArea.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        document: any;
        grantId: string;
        grantType: string;
    };

    function updateImage() {
        const current = grant?.img;

        const filePicker = new FilePicker({
            type: "image",
            current,
            callback: (path) => {
                onUpdateValue("img", path);
            },
        });

        return filePicker.browse();
    }

    async function openDocument(uuid: string) {
        const doc = await fromUuid(uuid);
        doc.sheet.render(true);
    }

    function onUpdateValue(key: string, value: any) {
        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField(item, key, value);
    }

    function updateFeature(type: string, idx: number, key: string, value: any) {
        const features = type === "base" ? baseFeatures : optionalFeatures;
        const feature = features[idx];
        feature[key] = value;

        onUpdateValue(`features.${type}`, features);
    }

    function onDropUpdate(key: string, value: string) {
        const feature = fromUuidSync(value);
        if (!feature) return;

        if (feature.type !== "feature") {
            return ui.notifications.error(
                "Invalid Document - Must be a Feature.",
            );
        }

        const entry = {
            uuid: value,
            limitedReselection: true,
            selectionLimit: 1,
        };

        if (key === "features.base") {
            onUpdateValue(key, [...baseFeatures, entry]);
        }

        if (key === "features.options") {
            onUpdateValue(key, [...optionalFeatures, entry]);
        }
    }

    function getFeatureData(data: any) {
        return data.map((e) => {
            const feature = fromUuidSync(e.uuid);
            return {
                uuid: e.uuid,
                name: feature?.name || "Unknown Feature",
                img: feature?.img || "",
                limitedReselection: e.limitedReselection,
                selectionLimit: e.selectionLimit,
            };
        });
    }

    let { document, grantId, grantType }: Props = $props();

    let item = document;

    let grant = $derived(item.reactive.system.grants[grantId]);
    let baseFeatures = $derived(getFeatureData(grant.features.base ?? []));
    let optionalFeatures = $derived(
        getFeatureData(grant.features.options ?? []),
    );

    setContext("item", item);
    setContext("grantId", grantId);
    setContext("grantType", grantType);
</script>

<form class="a5e-grant">
    <header class="a5e-grant__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-grant-image"
            src={grant.img || item.img || "icons/svg/upgrade.svg"}
            alt={grant.label}
            onclick={updateImage}
        />

        <div class="a5e-grant-name-wrapper">
            <input
                class="a5e-input a5e-grant-name"
                type="text"
                name="name"
                value={grant.label ?? ""}
                placeholder="Bonus Name"
                onchange={({ currentTarget }) =>
                    onUpdateValue("label", currentTarget.value)}
            />
        </div>
    </header>

    <Section heading="Base Features" --a5e-section-margin="0.25rem 0">
        <DropArea
            type="uuid"
            documentType="Item"
            onDocumentDropped={(data) =>
                onDropUpdate("features.base", data.uuid)}
        />

        {#if baseFeatures.length > 0}
            <div class="feature-table">
                <header class="feature-table__header">
                    <span class="feature-table__heading"></span>
                    <span class="feature-table__heading"></span>
                    <span class="feature-table__heading">
                        Limited Reselection
                    </span>
                    <span class="feature-table__heading">Selection Limit</span>
                    <span class="feature-table__heading"></span>
                </header>

                <hr class="feature-table__rule" />

                {#each baseFeatures as feature, idx}
                    <img
                        class="feature-table__img"
                        src={feature.img}
                        alt={feature.name}
                    />

                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <span
                        class="feature-table__name"
                        onclick={() => openDocument(feature.uuid)}
                    >
                        {feature.name}
                    </span>

                    <input
                        class="feature-table__limited-reselection"
                        type="checkbox"
                        checked={feature.limitedReselection ?? true}
                        onchange={({ currentTarget }) =>
                            updateFeature(
                                "base",
                                idx,
                                "limitedReselection",
                                currentTarget.checked,
                            )}
                    />

                    <span class="feature-table__selection-limit">
                        {#if feature.limitedReselection}
                            <input
                                class="a5e-input a5e-input--slim a5e-input--small"
                                type="number"
                                value={feature.selectionLimit ?? 1}
                                onchange={({ currentTarget }) =>
                                    updateFeature(
                                        "base",
                                        idx,
                                        "selectionLimit",
                                        Number(currentTarget.value),
                                    )}
                            />
                        {:else}
                            <i class="icon fa-solid fa-infinity"></i>
                        {/if}
                    </span>

                    <button
                        class="feature-table__delete-button"
                        aria-label="Delete Feature"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onUpdateValue(
                                "features.base",
                                baseFeatures.filter((_, i) => i !== idx),
                            );
                        }}
                    >
                        <i class="icon fa-solid fa-trash"></i>
                    </button>
                {/each}
            </div>
        {/if}
    </Section>

    <Section heading="Optional Features" --a5e-section-margin="0.25rem 0">
        <DropArea
            type="uuid"
            documentType="Item"
            onDocumentDropped={(data) =>
                onDropUpdate("features.options", data.uuid)}
        />

        {#if optionalFeatures.length > 0}
            <div class="feature-table">
                <header class="feature-table__header">
                    <span class="feature-table__heading"></span>
                    <span class="feature-table__heading"></span>
                    <span class="feature-table__heading">
                        Limited Reselection
                    </span>
                    <span class="feature-table__heading">Selection Limit</span>
                    <span class="feature-table__heading"></span>
                </header>

                <hr class="feature-table__rule" />

                {#each optionalFeatures as feature, idx}
                    <img
                        class="feature-table__img"
                        src={feature.img}
                        alt={feature.name}
                    />

                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <span
                        class="feature-table__name"
                        onclick={() => openDocument(feature.uuid)}
                    >
                        {feature.name}
                    </span>

                    <input
                        class="feature-table__limited-reselection"
                        type="checkbox"
                        checked={feature.limitedReselection ?? true}
                        onchange={({ currentTarget }) =>
                            updateFeature(
                                "options",
                                idx,
                                "limitedReselection",
                                currentTarget.checked,
                            )}
                    />

                    <span class="feature-table__selection-limit">
                        {#if feature.limitedReselection}
                            <input
                                class="a5e-input a5e-input--slim a5e-input--small"
                                type="number"
                                value={feature.selectionLimit ?? 1}
                                onchange={({ currentTarget }) =>
                                    updateFeature(
                                        "options",
                                        idx,
                                        "selectionLimit",
                                        Number(currentTarget.value),
                                    )}
                            />
                        {:else}
                            <i class="icon fa-solid fa-infinity"></i>
                        {/if}
                    </span>

                    <button
                        class="feature-table__delete-button"
                        aria-label="Delete Feature"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            onUpdateValue(
                                "features.options",
                                optionalFeatures.filter((_, i) => i !== idx),
                            );
                        }}
                    >
                        <i class="icon fa-solid fa-trash"></i>
                    </button>
                {/each}
            </div>
        {/if}
    </Section>

    <GrantConfig>
        <FieldWrapper heading="Selectable Options Count">
            <input
                type="number"
                value={grant.features.total ?? 0}
                onchange={({ currentTarget }) =>
                    onUpdateValue(
                        "features.total",
                        Number(currentTarget.value),
                    )}
            />
        </FieldWrapper>
    </GrantConfig>
</form>

<style lang="scss">
    .feature-table {
        display: grid;
        grid-template-columns: 2rem 1fr max-content max-content 2rem;
        align-items: center;
        column-gap: 0.75rem;
        row-gap: 0.25rem;
        margin-top: 0.5rem;
        padding: 0.25rem;

        &__header {
            display: contents;
            font-size: var(--a5e-sm-text);
            text-align: center;
        }

        &__heading {
            font-size: inherit;
            font-weight: bold;
        }

        &__rule {
            width: 100%;
            grid-column: span 5;
            margin-block: 0.25rem;
            border: 0.5px solid var(--a5e-border-color);
        }

        &__img {
            width: 1.7rem;
            height: 1.7rem;
            border-radius: 4px;
        }

        &__name {
            font-size: var(--a5e-sm-text);
            text-align: left;
            width: 100%;
            text-overflow: ellipsis;
        }

        &__limited-reselection {
            display: flex;
            justify-content: center;
            width: 100%;

            &:focus-visible {
                box-shadow: none;
                outline: none;
            }
        }

        &__selection-limit {
            display: flex;
            justify-content: center;
            align-content: center;
            text-align: center;
        }

        &__delete-button {
            all: unset;
            display: flex;
            justify-content: center;

            cursor: pointer;
            font-size: var(--a5e-sm-text);
            grid-column: 5;
        }
    }
</style>
