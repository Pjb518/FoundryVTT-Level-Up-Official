<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        document: any;
    };

    let { document }: Props = $props();

    let actor = document;
    let formula = $derived(actor.reactive.system.collisionFormula);

    function save(value: string) {
        const trimmed = value.trim();

        if (trimmed && !Roll.validate(trimmed)) {
            ui.notifications.warn(localize("A5E.vehicle.collision.invalidFormula"));
            return;
        }

        updateDocumentDataFromField(actor, "system.collisionFormula", trimmed);
    }
</script>

<Section --a5e-section-body-gap="0.75rem" --a5e-section-padding="0.75rem">
    <FieldWrapper
        heading="A5E.vehicle.collision.damage"
        hint="A5E.vehicle.collision.configureHint"
    >
        <input
            class="a5e-input a5e-input--slim"
            type="text"
            value={formula}
            placeholder={actor.reactive.sizeCollisionFormula}
            onchange={({ currentTarget }) => save(currentTarget.value)}
        />
    </FieldWrapper>
</Section>
