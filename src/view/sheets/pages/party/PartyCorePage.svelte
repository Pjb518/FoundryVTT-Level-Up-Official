<script lang="ts">
	import { getContext } from 'svelte';
	import RadioGroup from '#view/snippets/RadioGroup.svelte';
	import Tag from '#view/snippets/Tag.svelte';

	function getActorDetails(actor: Creature) {}

	function getPartySkills() {}

	function getPartyLanguages() {
		const languages: Record<string, string[]> = {};

		members.forEach((m) => {
			m.reactive.system.proficiencies.languages.forEach((l) => {
				languages[l] ??= [];
				languages[l].push(m.name);
			});
		});

		return languages;
	}

	const overviewSections = [
		['languages', 'Languages'],
		['skills', 'Skills'],
		['sttributes', 'Attributes'],
	];

	let party: Actor.OfType<'party'> = getContext('party');
	let members = $derived(party.reactive.members);

	let overviewSection = $state('languages');
	let partyLanguages = $derived(getPartyLanguages());
</script>

<!-- Overivew Section -->
<section>
	<RadioGroup
		options={overviewSections}
		selected={overviewSection}
		allowDeselect={false}
		onUpdateSelection={(value) => overviewSection = value}
	/>

	{#if overviewSection === 'languages'}
		<ul class="a5e-party-sheet__tag-list">
			{#each Object.entries(partyLanguages) as [lang, actors]}
				<Tag
					label={CONFIG.A5E.languages[lang] || lang}
					displayOnly={true}
					tooltipText={actors.join(', ')}
					tight={true}
					tooltipDirection="UP"
				/>
			{/each}
		</ul>
	{:else if overviewSection === 'skills'}
		TBD
	{/if}
</section>

<!-- Member Section -->
<section>
	{#each members as actor}
		{const actorData = $derived(actor.reactive.system)}
		<div>
			<!-- Image & HP -->
			<div>
				<img src={actor.reactive.img} alt={actor.reactive.img}>

				<span>
					{actorData.attributes.hp.value}
					/
					{actorData.attributes.hp.max}
				</span>
			</div>

			<!-- Name and Details -->
			<div>
				<span>
					{actor.reactive.name}
				</span>

				<span>{getActorDetails(actor)}</span>

				<div>
					<!-- Inspiration -->
				</div>
			</div>

			<!-- AC, SAVES & SENSES -->
			<div>
				<div>
					{actorData.attributes.ac.value}
				</div>

				<div>
					<!-- Saves -->
				</div>

				<!-- Senses -->
				<div></div>
			</div>

			<!-- Skills -->
			<div></div>
		</div>
	{/each}
</section>

<style lang="scss">
    .a5e-party-sheet {
        &__tag-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;

            padding: 0;
            list-style-type: none;
            font-size: var(--a5e-sm-text);
        }
    }
</style>
