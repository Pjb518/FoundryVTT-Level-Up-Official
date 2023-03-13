<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import Editor from "../Editor.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let currentEditor;
    const actor = getContext("actor");

    const charChoicesLabel = {
        classes: "A5E.ClassPlural",
        archetype: "A5E.Archetype",
        // background: "A5E.Background",
        // culture: "A5E.Culture",
        // destiny: "A5E.Destiny",
        // heritage: "A5E.Heritage",
        prestige: "A5E.Prestige",
    };

    const traitsLabel = {
        age: "A5E.DetailsAge",
        eyeColor: "A5E.DetailsEyeColor",
        hairColor: "A5E.DetailsHairColor",
        skinColor: "A5E.DetailsSkinColor",
        height: "A5E.DetailsHeight",
        weight: "A5E.DetailsWeight",
        gender: "A5E.DetailsGender",
    };

    function onSelectEditor(editor) {
        currentEditor = editor;
    }

    $: currentEditor = "bio";
    $: details = $actor.system.details;
</script>

<div class="bio-page">
    <section class="a5e-box u-p-md a5e-form__section--bio-wrapper">
        {#each Object.entries(charChoicesLabel) as [key, label]}
            <div
                class="u-flex u-flex-col a5e-input-container u-gap-xs"
                data-type={key}
            >
                <label
                    class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0"
                    for="{actor.id}-details-{key}"
                >
                    {localize(label)}
                </label>

                <input
                    class="a5e-input a5e-input--slim u-w-full"
                    id="{actor.id}-details-{key}"
                    type="text"
                    name="system.details.{key}"
                    value={details[key] ?? ""}
                    on:change={({ target }) => {
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            key === "prestige"
                                ? Number(target.value)
                                : target.value
                        );
                    }}
                />
            </div>
        {/each}
    </section>

    <section class="a5e-box u-p-md a5e-form__section--bio-wrapper">
        {#each Object.entries(traitsLabel) as [key, label]}
            <div
                class="u-flex u-flex-col a5e-input-container u-gap-xs"
                data-type={key}
            >
                <label
                    class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0"
                    for="{actor.id}-details-{key}"
                >
                    {localize(label)}
                </label>

                <input
                    class="a5e-input a5e-input--slim"
                    id="{actor.id}-details-{key}"
                    type="text"
                    name="system.details.{key}"
                    value={details[key]}
                    on:change={({ target }) => {
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        );
                    }}
                />
            </div>
        {/each}
    </section>

    <section />

    <section class="u-flex u-flex-grow u-gap-lg">
        <div class="u-flex u-flex-col u-flex-grow">
            <div
                class="
                u-align-center
                u-border-b
                u-border-gray
                u-flex
                u-gap-lg
                u-mb-md
                u-pb-md
            "
            >
                <!-- svelte-ignore a11y-missing-attribute -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <a
                    class="
                    a5e-button
                    u-border
                    u-hover-bg-green
                    u-hover-text-light
                    u-p-sm
                    u-rounded
                    u-text-sm
                    u-transition
                    u-hover-text-shadow-none
                "
                    class:u-border-gray={currentEditor !== "bio"}
                    class:u-bg-green={currentEditor === "bio"}
                    class:u-border-green={currentEditor === "bio"}
                    class:u-text-light={currentEditor === "bio"}
                    on:click={() => onSelectEditor("bio")}
                >
                    {localize("A5E.DetailsBackstory")}
                </a>

                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                    class="
                    a5e-button
                    u-border
                    u-hover-bg-green
                    u-hover-text-light
                    u-p-sm
                    u-rounded
                    u-text-sm
                    u-transition
                    u-hover-text-shadow-none
                "
                    class:u-border-gray={currentEditor !== "appearance"}
                    class:u-bg-green={currentEditor === "appearance"}
                    class:u-border-green={currentEditor === "appearance"}
                    class:u-text-light={currentEditor === "appearance"}
                    on:click={() => onSelectEditor("appearance")}
                >
                    {localize("A5E.DetailsAppearance")}
                </a>
            </div>

            <Editor
                document={actor}
                content={$actor.system.details[currentEditor]}
                updatePath={`system.details.${currentEditor}`}
            />
        </div>
    </section>
</div>

<style lang="scss">
    .bio-page {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
        overflow-y: auto;
    }
</style>
