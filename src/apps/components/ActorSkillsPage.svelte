<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    const actor = getContext("actor");
</script>

<ul class="skills-container">
    {#each Object.entries(CONFIG.A5E.skills) as [skill, label]}
        <li class="skill" data-skill={skill}>
            {localize(label)}
        </li>
    {/each}
</ul>

<style lang="scss">
    .skills-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.25rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .skill {
        border: 1px solid #ccc;
        padding: 0.5rem;
    }
</style>
