<script>
    import { getContext, onDestroy, setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import DropArea from "../dropAreas/DropArea.svelte";
    import DropTag from "../DropTag.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";
    import GrantConfig from "./GrantConfig.svelte";
    import Checkbox from "../Checkbox.svelte";

    export let { document, grantId, grantType } =
        getContext("#external").application;

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

    function onUpdateValue(key, value) {
        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField($item, key, value);
    }

    function updateFeature(type, idx, key, value) {
        const features = type === "base" ? baseFeatures : optionalFeatures;
        const feature = features[idx];
        feature[key] = value;

        onUpdateValue(`features.${type}`, features);
    }

    function onDropUpdate(key, value) {
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

    function getFeatureData(data) {
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

    onDestroy(() => {
        item.destroy();
    });

    const item = new TJSDocument(document);

    $: grant = $item.system.grants[grantId];
    $: baseFeatures = getFeatureData(grant.features.base ?? []);
    $: optionalFeatures = getFeatureData(grant.features.options ?? []);

    setContext("item", item);
    setContext("grantId", grantId);
    setContext("grantType", grantType);
</script>

<form>
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img
            class="grant-image"
            src={grant.img || $item.img || "icons/svg/upgrade.svg"}
            alt={grant.label}
            on:click={updateImage}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={grant.label ?? ""}
                class="grant-name"
                placeholder="Bonus Name"
                on:change={({ target }) => onUpdateValue("label", target.value)}
            />
        </div>
    </header>

    <Section heading="Base Features" --a5e-section-margin="0.25rem 0">
        <DropArea
            type="uuid"
            documentType="Item"
            on:document-dropped={({ detail }) =>
                onDropUpdate("features.base", detail.uuid)}
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

                    <span class="feature-table__name">{feature.name}</span>

                    <input
                        class="feature-table__limited-reselection"
                        type="checkbox"
                        checked={feature.limitedReselection ?? true}
                        on:change={({ target }) =>
                            updateFeature(
                                "base",
                                idx,
                                "limitedReselection",
                                target.checked,
                            )}
                    />

                    <span class="feature-table__selection-limit">
                        {#if feature.limitedReselection}
                            <input
                                class="a5e-input a5e-input--slim a5e-input--small"
                                type="number"
                                value={feature.selectionLimit ?? 1}
                                on:change={({ target }) =>
                                    updateFeature(
                                        "base",
                                        idx,
                                        "selectionLimit",
                                        Number(target.value),
                                    )}
                            />
                        {:else}
                            <i class="fa-solid fa-infinity" />
                        {/if}
                    </span>

                    <button
                        class="feature-table__delete-button"
                        on:click|preventDefault|stopPropagation={() =>
                            onUpdateValue(
                                "features.base",
                                baseFeatures.filter((_, i) => i !== idx),
                            )}
                    >
                        <i class="fa-solid fa-trash" />
                    </button>
                {/each}
            </div>
        {/if}
    </Section>

    <Section heading="Optional Features" --a5e-section-margin="0.25rem 0">
        <DropArea
            type="uuid"
            documentType="Item"
            on:document-dropped={({ detail }) =>
                onDropUpdate("features.options", detail.uuid)}
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

                    <span class="feature-table__name">{feature.name}</span>

                    <input
                        class="feature-table__limited-reselection"
                        type="checkbox"
                        checked={feature.limitedReselection ?? true}
                        on:change={({ target }) =>
                            updateFeature(
                                "options",
                                idx,
                                "limitedReselection",
                                target.checked,
                            )}
                    />

                    <span class="feature-table__selection-limit">
                        {#if feature.limitedReselection}
                            <input
                                class="a5e-input a5e-input--slim a5e-input--small"
                                type="number"
                                value={feature.selectionLimit ?? 1}
                                on:change={({ target }) =>
                                    updateFeature(
                                        "options",
                                        idx,
                                        "selectionLimit",
                                        Number(target.value),
                                    )}
                            />
                        {:else}
                            <i class="fa-solid fa-infinity" />
                        {/if}
                    </span>

                    <button
                        class="feature-table__delete-button"
                        on:click|preventDefault|stopPropagation={() =>
                            onUpdateValue(
                                "features.options",
                                optionalFeatures.filter((_, i) => i !== idx),
                            )}
                    >
                        <i class="fa-solid fa-trash" />
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
                on:change={({ target }) =>
                    onUpdateValue("features.total", Number(target.value))}
            />
        </FieldWrapper>
    </GrantConfig>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--padding, 0.75rem);
        gap: 0.75rem;
        background: var(--background, $color-sheet-background);
        max-height: 70vh;
        overflow-y: auto;
    }

    .grant-name,
    .grant-name[type="text"] {
        font-family: $font-primary;
        font-size: $font-size-xxl;
        border: 0;
        background: transparent;
        text-overflow: ellipsis;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .grant-image {
        width: 2rem;
        height: 2rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .name-wrapper {
        width: 100%;
    }

    .sheet-header {
        display: flex;
        align-items: center;
    }

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
            font-size: var(--a5e-font-size-sm);
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
            border: 0.5px solid #ccc;
        }

        &__img {
            width: 1.7rem;
            height: 1.7rem;
            border-radius: 4px;
        }

        &__name {
            font-size: var(--a5e-font-size-sm);
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
            font-size: var(--a5e-font-size-sm);
            grid-column: 5;
        }
    }
</style>
