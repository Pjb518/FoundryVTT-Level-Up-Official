<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Editor from "../Editor.svelte";
    import FormSection from "../FormSection.svelte";
    import SecondaryNavigationBar from "../navigation/SecondaryNavigationBar.svelte";

    import ActorSheetTempSettingsStore from "../../../stores/ActorSheetTempSettingsStore";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    function updateCurrentTab({ detail: name }) {
        const { uuid } = $actor;
        currentTab = name;

        ActorSheetTempSettingsStore.update((currentSettings) => ({
            ...currentSettings,
            [uuid]: {
                ...(currentSettings[uuid] ?? {}),
                currentNotesTab: name,
            },
        }));
    }

    const actor = getContext("actor");
    let isGM = game.user.isGM;

    const tabs = {
        appearance: {
            label: "Character Details",
            display: $actor.type === "character",
        },
        bio: {
            label: $actor.type === "npc" ? "A5E.TabBiography" : "Backstory",
            display:
                $actor.type === "character" || (isGM && $actor.type === "npc"),
        },
        notes: {
            label: "A5E.TabNotes",
        },
        privateNotes: {
            label: "A5E.DetailsNotesPrivate",
            display: isGM && $actor.type === "npc",
        },
    };

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

    let tempSettings = {};

    ActorSheetTempSettingsStore.subscribe((store) => {
        tempSettings = store;
    });

    let currentTab =
        tempSettings[$actor?.uuid]?.currentNotesTab ??
        ($actor.type === "npc" ? "bio" : "appearance");
</script>

<SecondaryNavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

<div class="notes-page">
    {#if currentTab === "appearance"}
        <section class="a5e-box u-p-md a5e-form__section--bio-wrapper">
            {#each Object.entries(charChoicesLabel) as [key, label]}
                <FormSection
                    heading={label}
                    --background="none"
                    --direction="column"
                    --gap="0.25rem"
                    --padding="0"
                >
                    <input
                        class="a5e-input a5e-input--slim u-w-full"
                        class:disable-pointer-events={!$actor.isOwner}
                        id="{actor.id}-details-{key}"
                        type="text"
                        name="system.details.{key}"
                        value={$actor.system.details[key] ?? ""}
                        on:change={({ target }) => {
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                key === "prestige"
                                    ? Number(target.value)
                                    : target.value,
                            );
                        }}
                    />
                </FormSection>
            {/each}
        </section>

        <section class="a5e-box u-p-md a5e-form__section--bio-wrapper">
            {#each Object.entries(traitsLabel) as [key, label]}
                <FormSection
                    heading={label}
                    --background="none"
                    --direction="column"
                    --gap="0.25rem"
                    --padding="0"
                >
                    <input
                        class="a5e-input a5e-input--slim"
                        class:disable-pointer-events={!$actor.isOwner}
                        id="{actor.id}-details-{key}"
                        type="text"
                        name="system.details.{key}"
                        value={$actor.system.details[key]}
                        on:change={({ target }) => {
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.value,
                            );
                        }}
                    />
                </FormSection>
            {/each}
        </section>

        <heading class="a5e-section-header">
            <h3 class="a5e-section-header__heading">Appearance</h3>
        </heading>
    {/if}

    <Editor
        document={actor}
        content={$actor.system.details[currentTab]}
        updatePath="system.details.{currentTab}"
    />
</div>

<style lang="scss">
    .notes-page {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
        overflow: hidden;
    }

    .notes {
        &__container {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            gap: 0.5rem;
            overflow-y: auto;
        }

        &__tabs {
            display: flex;
            align-content: center;
            gap: 0.75rem;
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #ccc;
        }
    }

    button {
        background: transparent;
        border: 1px solid #ccc;
        width: fit-content;
        padding-inline: 0.75rem;

        &:focus,
        &:hover {
            box-shadow: none;
        }
    }

    .active {
        background: $color-primary;
        border: 1px solid $color-primary;
        color: white;
    }
</style>
