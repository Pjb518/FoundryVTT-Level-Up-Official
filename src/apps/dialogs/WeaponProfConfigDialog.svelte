<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import InputField from "../components/InputField.svelte";
    import Section from "../components/Section.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { application } = getContext("#external");
    export let {
        document,
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
            proficiencies,
        );
    }

    function submitForm() {
        application.submit({
            weapons,
        });
    }

    const actor = document;
    const { A5E } = CONFIG;
    const { martial, rare, simple } = A5E.weaponsPlural;

    $: weapons = submitDialog
        ? dialogWeapons
        : $actor.system.proficiencies.weapons;

    $: weaponProficiencies = weapons.reduce(
        (acc, curr) => {
            if (Object.keys(martial).includes(curr)) {
                acc.martial.push(curr);
            } else if (Object.keys(simple).includes(curr)) {
                acc.simple.push(curr);
            } else if (Object.keys(rare).includes(curr)) {
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
        },
    );

    $: otherProficiencies = weaponProficiencies.other.join("; ");
</script>

<Section
    hint={dialogHint}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-padding="0.75rem"
    --a5e-section-margin="0"
>
    <CheckboxGroup
        heading="A5E.WeaponsSimple"
        options={Object.entries(simple)}
        selected={weaponProficiencies.simple}
        disabled={weapons.length >= max}
        disabledOptions={submitDialog
            ? $actor.system.proficiencies.weapons
            : []}
        red={submitDialog ? $actor.system.proficiencies.weapons : []}
        showToggleAllButton={true}
        on:updateSelection={({ detail }) => {
            weaponProficiencies.simple = detail;
            updateFunction();
        }}
    />

    <CheckboxGroup
        heading="A5E.WeaponsMartial"
        options={Object.entries(martial)}
        selected={weaponProficiencies.martial}
        disabled={weapons.length >= max}
        disabledOptions={submitDialog
            ? $actor.system.proficiencies.weapons
            : []}
        red={submitDialog ? $actor.system.proficiencies.weapons : []}
        showToggleAllButton={true}
        on:updateSelection={({ detail }) => {
            weaponProficiencies.martial = detail;
            updateFunction();
        }}
    />

    <CheckboxGroup
        heading="A5E.WeaponsRare"
        options={Object.entries(rare)}
        selected={weaponProficiencies.rare}
        disabled={weapons.length >= max}
        disabledOptions={submitDialog
            ? $actor.system.proficiencies.weapons
            : []}
        red={submitDialog ? $actor.system.proficiencies.weapons : []}
        showToggleAllButton={true}
        on:updateSelection={({ detail }) => {
            weaponProficiencies.rare = detail;
            updateFunction();
        }}
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
</Section>
