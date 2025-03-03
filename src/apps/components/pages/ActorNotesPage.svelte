<script>
import { getContext } from 'svelte';

import Editor from '../Editor.svelte';
import FieldWrapper from '../FieldWrapper.svelte';
import SecondaryNavigationBar from '../navigation/SecondaryNavigationBar.svelte';

import ActorSheetTempSettingsStore from '../../../stores/ActorSheetTempSettingsStore';

import updateDocumentDataFromField from '../../../utils/updateDocumentDataFromField';

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

const actor = getContext('actor');
let isGM = game.user.isGM;

const tabs = {
	appearance: {
		label: 'Character Details',
		display: $actor.type === 'character',
	},
	bio: {
		label: $actor.type === 'npc' ? 'A5E.TabBiography' : 'Backstory',
		display: $actor.type === 'character' || (isGM && $actor.type === 'npc'),
	},
	notes: {
		label: 'A5E.TabNotes',
	},
	privateNotes: {
		label: 'A5E.details.notesPrivate',
		display: isGM && $actor.type === 'npc',
	},
};

const charChoicesLabel = {
	classes: 'A5E.details.classPlural',
	archetype: 'A5E.details.archetype',
	// background: "A5E.details.background",
	// culture: "A5E.details.culture",
	// destiny: "A5E.details.destiny.title",
	// heritage: "A5E.details.heritage",
	prestige: 'A5E.details.prestige',
};

const traitsLabel = {
	age: 'A5E.details.age',
	eyeColor: 'A5E.details.eyeColor',
	hairColor: 'A5E.details.hairColor',
	skinColor: 'A5E.details.skinColor',
	height: 'A5E.details.height',
	weight: 'A5E.details.weight',
	gender: 'A5E.details.gender',
};

let tempSettings = {};

ActorSheetTempSettingsStore.subscribe((store) => {
	tempSettings = store;
});

let currentTab =
	tempSettings[$actor?.uuid]?.currentNotesTab ?? ($actor.type === 'npc' ? 'bio' : 'appearance');
</script>

<SecondaryNavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    {#if currentTab === "appearance"}
        <section class="a5e-box u-p-md a5e-form__section--bio-wrapper">
            {#each Object.entries(charChoicesLabel) as [key, label]}
                <FieldWrapper heading={label} --a5e-field-wrapper-gap="0.25rem">
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
                </FieldWrapper>
            {/each}
        </section>

        <section class="a5e-box u-p-md a5e-form__section--bio-wrapper">
            {#each Object.entries(traitsLabel) as [key, label]}
                <FieldWrapper heading={label} --a5e-field-wrapper-gap="0.25rem">
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
                </FieldWrapper>
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
