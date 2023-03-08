<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let consumerId;
    export let consumer;

    const { resourceRecoveryOptions } = CONFIG.A5E;

    const item = getContext("item");
    const actionId = getContext("actionId");
</script>

<div class="a5e-field-group">
    <div class="action-config__component">
        <div class="u-flex u-flex-col u-gap-xs u-w-30">
            <h3 class="u-text-sm">{localize("A5E.UsesCurrent")}</h3>

            <input
                class="a5e-input"
                type="number"
                name="system.actions.{actionId}.uses.{consumerId}.value"
                value={consumer.value ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        Number(target.value)
                    )}
            />
        </div>

        <div class="u-flex u-flex-col u-gap-xs u-w-30">
            <h3 class="u-text-sm">{localize("A5E.UsesMax")}</h3>

            <input
                class="a5e-input"
                type="number"
                name="system.actions.{actionId}.uses.{consumerId}.max"
                value={consumer.max ?? 0}
                min={consumer.value ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        Number(target.value)
                    )}
            />
        </div>

        <div class="u-flex u-flex-col u-gap-xs u-w-30">
            <h3 class="u-text-sm">{localize("A5E.UsesPer")}</h3>

            <select
                class="u-h-8 u-w-40"
                name="system.actions.{actionId}.uses.{consumerId}.per"
                value={consumer.per ?? ""}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        target.value
                    )}
            >
                <option value="" />

                {#each Object.entries(resourceRecoveryOptions) as [key, name]}
                    <option {key} value={key} selected={consumer.per === key}>
                        {localize(name)}
                    </option>
                {/each}
            </select>
        </div>
    </div>
</div>
