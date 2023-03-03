<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareAbilityOptions from "../../handlers/prepareAbilityOptions";

    import LinkedDocumentsHelper from "../../utils/LinkedDocumentsHelper";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import DropArea from "../DropArea.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import FormSection from "../FormSection.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";

    const item = getContext("item");

    const abilityOptions = [
        ["none", localize("A5E.None")],
        ...prepareAbilityOptions(),
    ];
    const skillOptions = Object.entries(CONFIG.A5E.skills);

    function addEquipmentItem(event) {
        const [dragEvent, _] = event.detail;

        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );

            if ($item.system.equipment.includes(uuid)) {
                ui.notifications.warn(
                    "Cannot add two items with the same UUID to a Background document's equipment section."
                );

                throw "Cannot add two items with the same UUID to the Background document's equipment section.";
            }

            $item.update({
                "system.equipment": [...$item.system.equipment, uuid],
            });
        } catch (err) {
            console.error(err);
        }
    }

    function replaceEquipmentItem(event) {
        const [dragEvent, feature] = event.detail;

        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );

            if ($item.system.equipment.includes(uuid)) {
                ui.notifications.warn(
                    "Cannot add two items with the same UUID to a Background document's equipment section."
                );

                throw "Cannot add two items with the same UUID to the Background document's equipment section.";
            }

            $item.system.equipment.splice(
                $item.system.equipment.findIndex(
                    (item) => item.uuid === feature.uuid
                ),
                1,
                uuid
            );

            $item.update({
                "system.equipment": $item.system.equipment,
            });

            feature.setFromUUID(uuid);
        } catch (err) {
            console.error(err);
        }
    }

    function deleteEquipmentItem(event) {
        const [_, feature] = event.detail;

        const index = $item.system.equipment.findIndex((item) => {
            return item === feature.get().uuid;
        });

        $item.system.equipment.splice(index, 1);

        $item.update({
            "system.equipment": $item.system.equipment,
        });
    }

    function updateFeature(event) {
        const [dragEvent, feature] = event.detail;

        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );

            $item.update({ "system.feature": uuid });
            feature.setFromUUID(uuid);
        } catch (err) {
            console.error(err);
        }
    }

    function deleteFeature(event) {
        const [_, feature] = event.detail;

        try {
            $item.update({ [`system.feature`]: "" });
            feature.set();
        } catch (err) {
            console.error(err);
        }
    }
</script>

<article>
    <section class="section-wrapper">
        <div class="u-flex u-align-center u-gap=md">
            <input
                class="u-pointer"
                type="checkbox"
                name="system.includesASI"
                id={`${$item.id}-includesASI`}
                checked={$item.system.includesASI}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        target.checked
                    )}
            />

            <label class="u-pointer" for={`${$item.id}-includesASI`}>
                {localize("A5E.ASIIncludes")}
            </label>
        </div>
    </section>

    {#if $item.system.includesASI}
        <section class="section-wrapper">
            <h3 class="section-title">
                {localize("A5E.ASIDefault")}
            </h3>
            <RadioGroup
                listClasses="u-gap-md u-text-sm"
                optionClasses="u-p-md u-text-center u-w-12"
                options={abilityOptions}
                selected={$item.system.defaultASI}
                name="system.defaultASI"
                document={item}
            />
        </section>
    {/if}
    <section class="section-wrapper">
        <h3 class="section-title">
            {localize("A5E.SkillPlural")}
        </h3>

        <CheckboxGroup
            options={skillOptions}
            selected={$item.system.proficiencies.skills.options}
            name="system.proficiencies.skills.options"
            document={item}
        />
    </section>

    <section class="section-wrapper">
        <h3 class="section-title">
            {localize("A5E.MaxSkillCount")}
        </h3>

        <div class="a5e-input-container a5e-input-container--numeric">
            <input
                class="a5e-input a5e-input--small"
                type="number"
                name="system.proficiencies.skills.count"
                value={$item.system.proficiencies.skills.count}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        Number(target.value)
                    )}
            />
        </div>
    </section>

    <section class="section-wrapper">
        <h3 class="section-title">
            {localize("A5E.ToolPlural")}
        </h3>
    </section>

    <section class="section-wrapper">
        <h3 class="section-title">
            {localize("A5E.TabFeatures")}
        </h3>

        <DropArea
            uuid={$item.system.feature || null}
            on:item-dropped={updateFeature}
            on:item-deleted={deleteFeature}
        />
    </section>

    <section class="section-wrapper">
        <h3 class="section-title">
            {localize("A5E.Equipment")}
        </h3>

        <DropArea uuid={null} on:item-dropped={null} />

        <ul>
            {#each $item.system.equipment as [uuid] (`${uuid}`)}
                <li>
                    {uuid}
                </li>
            {/each}
        </ul>
    </section>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-inline: 0.5rem;
        overflow-y: auto;
    }

    .drop-area__container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .section-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.275rem;
    }
    .section-title {
        font-size: 0.833rem;
        font-family: "Signika", sans-serif;
        font-weight: bold;
        margin-bottom: 0.125rem;
    }
</style>
