<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import TagGroup from "../components/TagGroup.svelte";
    import InputField from "../components/InputField.svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actor, appId } = getContext("external").application;

    function updateFunction() {
        const proficiencies = [
            ...weaponProficiencies.martial,
            ...weaponProficiencies.simple,
            ...weaponProficiencies.rare,
            ...otherProficiencies
                .split(";")
                .map((tool) => tool.trim())
                .filter(Boolean),
        ];

        updateDocumentDataFromField(
            $actor,
            "system.proficiencies.weapons",
            proficiencies
        );
    }

    const martialWeapons = CONFIG.A5E.weaponsPlural.martial;
    const rareWeapons = CONFIG.A5E.weaponsPlural.rare;
    const simpleWeapons = CONFIG.A5E.weaponsPlural.simple;

    $: weaponProficiencies = $actor.system.proficiencies.weapons.reduce(
        (acc, curr) => {
            if (Object.keys(martialWeapons).includes(curr)) {
                acc.martial.push(curr);
            } else if (Object.keys(simpleWeapons).includes(curr)) {
                acc.simple.push(curr);
            } else if (Object.keys(rareWeapons).includes(curr)) {
                acc.rare.push(curr);
            } else {
                acc.other.push(curr);
            }

            return acc;
        },
        {
            simple: [],
            martial: [],
            rare: [],
            other: [],
        }
    );

    $: otherProficiencies = weaponProficiencies.other.join("; ");
</script>

<form class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog u-bg-none">
    <TagGroup
        heading="A5E.WeaponsSimple"
        tags={simpleWeapons}
        bind:selected={weaponProficiencies.simple}
        {updateFunction}
    />

    <TagGroup
        heading="A5E.WeaponsMartial"
        tags={martialWeapons}
        bind:selected={weaponProficiencies.martial}
        {updateFunction}
    />

    <TagGroup
        heading="A5E.WeaponsRare"
        tags={rareWeapons}
        bind:selected={weaponProficiencies.rare}
        {updateFunction}
    />

    <InputField
        heading="A5E.WeaponsOther"
        hint="A5E.HintSeparateBySemiColon"
        bind:fieldValue={otherProficiencies}
        {updateFunction}
    />
</form>
