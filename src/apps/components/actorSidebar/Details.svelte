<script>
	import { getContext } from 'svelte';
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

	import prepareArmorProficiencies from '../../handlers/prepareArmorProficiencies';
	import prepareConditionImmunities from '../../handlers/prepareConditionImmunities';
	import prepareDamageImmunities from '../../handlers/prepareDamageImmunities';
	import prepareDamageResistances from '../../handlers/prepareDamageResistances';
	import prepareDamageVulnerabilities from '../../handlers/prepareDamageVulnerabilities';
	import prepareLanguageProficiencies from '../../handlers/prepareLanguageProficiencies';
	import prepareSenses from '../../handlers/prepareSenses';
	import prepareToolProficiencies from '../../handlers/prepareToolProficiencies';
	// import prepareWeaponProficiencies from '../../handlers/prepareWeaponProficiencies';

	const actor = getContext('actor');

	$: details = [
		{
			label: localize('A5E.ArmorProficiencies'),
			values: prepareArmorProficiencies($actor),
		},
		{
			label: localize('A5E.ConditionImmunities'),
			values: prepareConditionImmunities($actor),
		},
		{
			label: localize('A5E.DamageImmunities'),
			values: prepareDamageImmunities($actor),
		},
		{
			label: localize('A5E.DamageResistances'),
			values: prepareDamageResistances($actor),
		},
		{
			label: localize('A5E.DamageVulnerabilities'),
			values: prepareDamageVulnerabilities($actor),
		},
		{
			label: localize('A5E.Languages'),
			values: prepareLanguageProficiencies($actor),
		},
		{ label: localize('A5E.SensesSpecial'), values: prepareSenses($actor) },
		{
			label: localize('A5E.ToolProficiencies'),
			values: prepareToolProficiencies($actor),
		},
		// {
		// 	label: localize('weaponProf'),
		// 	values: prepareWeaponProficiencies($actor),
		// },
	];

	$: sheetisLocked = $actor.flags?.a5e?.sheetisLocked ?? true;
</script>

{#each details as { label, values }}
	<section>
		<h2 class="u-text-bold u-text-sm">
			{label}
		</h2>

		{#if !sheetisLocked}
			<i class="a5e-config-button a5e-config-button--details fas fa-cog" />
		{/if}

		<ul
			class="
        u-flex
        u-flex-wrap
        u-font-san-serif
        u-gap-xs
        u-list-style-none
        u-m-0
        u-p-0
        u-text-xxs
      "
		>
			{#each values as tag}
				<li class="a5e-tag a5e-tag--tight">
					{tag}
				</li>
			{/each}
		</ul>
	</section>
{/each}

<style lang="scss"></style>
