<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
	import { getContext, setContext } from 'svelte';
	import ActorDocument from '../ActorDocument';

	import ActorCorePage from '../components/ActorCorePage.svelte';
	import ActorBioPage from '../components/ActorBioPage.svelte';
	import ActorEffectsPage from '../components/ActorEffectsPage.svelte';
	import ActorFeaturesPage from '../components/ActorFeaturesPage.svelte';
	import ActorInventoryPage from '../components/ActorInventoryPage.svelte';
	import ActorManeuversPage from '../components/ActorManeuversPage.svelte';
	import ActorSheetHeader from '../components/actorSheetHeader/actorSheetHeader.svelte';
	import ActorSidebar from '../components/actorSidebar/ActorSidebar.svelte';
	import ActorSkillsPage from '../components/ActorSkillsPage.svelte';
	import ActorSpellsPage from '../components/ActorSpellsPage.svelte';
	import NavigationBar from '../components/navigation/NavigationBar.svelte';

	export let { actorDocument, sheet } = getContext('external').application;
	export let currentTab;
	export let elementRoot;

	function updateCurrentTab(event) {
		currentTab = tabs[event.detail];
	}

	async function onDrop(event) {
		const { uuid } = JSON.parse(event.dataTransfer.getData('text/plain'));
		const item = await fromUuid(uuid);

		if (item.type === 'background') {
			sheet._onDropBackground(item);
		}
	}

	const tabs = [
		{
			name: 'core',
			label: 'A5E.TabCore',
			component: ActorCorePage,
		},
		{
			name: 'skills',
			label: 'A5E.TabSkills',
			component: ActorSkillsPage,
		},
		{
			name: 'inventory',
			label: 'A5E.TabInventory',
			component: ActorInventoryPage,
		},
		{
			name: 'features',
			label: 'A5E.TabFeatures',
			component: ActorFeaturesPage,
		},
		{
			name: 'maneuvers',
			label: 'A5E.TabManeuvers',
			component: ActorManeuversPage,
		},
		{
			name: 'spells',
			label: 'A5E.TabSpells',
			component: ActorSpellsPage,
		},
		{
			name: 'notes',
			label: 'A5E.TabNotes',
			component: ActorCorePage,
		},
		{
			name: 'effects',
			label: 'A5E.TabEffects',
			component: ActorEffectsPage,
		},
		{
			name: 'settings',
			label: 'A5E.TabSettings',
			component: ActorCorePage,
		},
	];

	if (actorDocument.type === 'character') {
		tabs.splice(6, 0, {
			name: 'biography',
			label: 'A5E.TabBiography',
			component: ActorBioPage,
		});
	}

	$: currentTab = tabs[0];

	setContext('actor', new ActorDocument(actorDocument));
</script>

<ApplicationShell bind:elementRoot>
	<main on:drop|preventDefault|stopPropagation={event => onDrop(event)}>
		<ActorSidebar />

		<section class="main-container">
			<ActorSheetHeader />

			<NavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

			<svelte:component this={currentTab.component} />
		</section>
	</main>
</ApplicationShell>

<style lang="scss">
	:global {
		.a5e-actor-sheet {
			min-width: 45.625rem;
		}

		.a5e-sheet .window-content {
			padding: 0;
			overflow-y: hidden;
		}
	}

	main {
		display: flex;
		height: 100%;
		background: rgba(246, 242, 235, 0.5);
	}

	.main-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		height: 100%;
		padding: 0.75rem;
		overflow: hidden;
	}
</style>
