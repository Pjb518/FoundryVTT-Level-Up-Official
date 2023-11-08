<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import TagGroup from "../components/TagGroup.svelte";
    import InputField from "../components/InputField.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { application } = getContext("#external");
    export let {
        actorDocument,
        appId,
        max,
        submitDialog,
        dialogWeapons,
        dialogHint,
    } = getContext("#external").application;

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

        if (submitDialog) {
            dialogWeapons = proficiencies.slice(0, max);
            return;
        }

        updateDocumentDataFromField(
            $actor,
            "system.proficiencies.weapons",
            proficiencies
        );
    }

    function submitForm() {
        application.submit({
            weapons,
        });
    }

    const actor = new TJSDocument(actorDocument);
    const martialWeapons = CONFIG.A5E.weaponsPlural.martial;
    const rareWeapons = CONFIG.A5E.weaponsPlural.rare;
    const simpleWeapons = CONFIG.A5E.weaponsPlural.simple;

    $: weapons = submitDialog
        ? dialogWeapons
        : $actor.system.proficiencies.weapons;

    $: weaponProficiencies = weapons.reduce(
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
        options={simpleWeapons}
        bind:selected={weaponProficiencies.simple}
        disabled={weapons.length >= max}
        red={submitDialog ? $actor.system.proficiencies.weapons : false}
        {updateFunction}
    />

    <TagGroup
        heading="A5E.WeaponsMartial"
        options={martialWeapons}
        bind:selected={weaponProficiencies.martial}
        disabled={weapons.length >= max}
        red={submitDialog ? $actor.system.proficiencies.weapons : false}
        {updateFunction}
    />

    <TagGroup
        heading="A5E.WeaponsRare"
        options={rareWeapons}
        bind:selected={weaponProficiencies.rare}
        disabled={weapons.length >= max}
        red={submitDialog ? $actor.system.proficiencies.weapons : false}
        {updateFunction}
    />

    <InputField
        heading="A5E.WeaponsOther"
        hint="A5E.HintSeparateBySemiColon"
        bind:fieldValue={otherProficiencies}
        {updateFunction}
    />

    {#if submitDialog}
        <div class="u-flex">
            <button on:click|preventDefault={submitForm}>
                {localize("A5E.Submit")}
            </button>
        </div>
    {/if}
</form>
