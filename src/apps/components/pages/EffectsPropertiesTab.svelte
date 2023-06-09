<script>
    import { getContext } from "svelte";
    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    const effect = getContext("effect");
    const { A5E } = CONFIG;
</script>

<article>
    <FormSection heading="Effect Type">
        <RadioGroup
            options={Object.entries(A5E.itemActiveEffectTypes)}
            selected={$effect.flags?.a5e?.transferType ?? "passive"}
            on:updateSelection={({ detail }) =>
                $effect.update({ "flags.a5e.transferType": detail })}
        />
    </FormSection>
</article>
