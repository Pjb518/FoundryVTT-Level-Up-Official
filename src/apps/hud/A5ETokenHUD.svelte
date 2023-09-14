<svelte:options accessors={true} />

<script>
    import { setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    export let tokenDocument;
    export let HUD;

    const token = new TJSDocument(tokenDocument);

    const data = HUD.getData();
    const statusEffects = Object.values(data.statusEffects);
    const genericEffects = Object.values(data.genericConditions);

    setContext("token", token);
</script>

<div class="status-effects-conditions">
    {#each statusEffects as effect}
        <div class="conditon-container">
            <img
                class="effect-control {effect.cssClass}"
                src={effect.src}
                title={effect.title ?? ""}
                alt={effect.title ?? ""}
                data-status-id={effect.id}
            />
            <div class="condition-name">{effect.title}</div>
        </div>
    {/each}
</div>

<hr class="a5e-rule" />

<div class="generic-effects-container">
    {#each genericEffects as effect}
        <div class="condition-container">
            <img
                class="effect-control {effect.cssClass}"
                src={effect.src}
                title={effect.title ?? ""}
                alt={effect.title ?? ""}
                data-status-id={effect.id}
            />
        </div>
    {/each}
</div>
