<script lang="ts">
    import { setContext } from "svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import GrantConfig from "./GrantConfig.svelte";

    import DropArea from "#view/snippets/DropArea.svelte";
    import DropTag from "#view/snippets/DropTag.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        document: any;
        grantId: string;
        grantType: string;
    };

    function updateImage() {
        const current = grant?.img;

        const filePicker = new FilePicker({
            type: "image",
            current,
            callback: (path) => {
                onUpdateValue("img", path);
            },
        });

        return filePicker.browse();
    }

    function onUpdateValue(key: string, value: any) {
        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField(item, key, value);
    }

    function onDropUpdate(key: string, value: any) {
        if (key === "items.base") {
            if (baseUuids.includes(value)) return;

            const updateArray = [...(grant.items.base ?? [])];
            const doc = fromUuidSync(value);
            updateArray.push({ uuid: value, quantity: doc.system.quantity });
            onUpdateValue(key, updateArray);
        }

        if (key === "items.options") {
            if (optionalUuids.includes(value)) return;

            const updateArray = [...(grant.items.options ?? [])];
            const doc = fromUuidSync(value);
            updateArray.push({ uuid: value, quantity: doc.system.quantity });
            onUpdateValue(key, updateArray);
        }
    }

    let { document, grantId, grantType }: Props = $props();

    let item = document;

    let grant = $derived(item.reactive.system.grants[grantId]);
    let baseUuids = $derived(grant.items.base.map((i) => i.uuid) ?? []);
    let optionalUuids = $derived(grant.items.options.map((i) => i.uuid) ?? []);

    setContext("item", item);
    setContext("grantId", grantId);
    setContext("grantType", grantType);
</script>

<form class="a5e-grant">
    <header class="a5e-grant__header">
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            class="a5e-grant-image"
            src={grant.img || item.img || "icons/svg/upgrade.svg"}
            alt={grant.label}
            onclick={updateImage}
        />

        <div class="a5e-grant-name-wrapper">
            <input
                type="text"
                name="name"
                value={grant.label ?? ""}
                class="a5e-grant-name"
                placeholder="Bonus Name"
                onchange={({ currentTarget }) =>
                    onUpdateValue("label", currentTarget.value)}
            />
        </div>
    </header>

    <Section heading="Base Items" --a5e-section-margin="0.25rem 0">
        <DropArea
            type="uuid"
            documentType="Item"
            onDocumentDropped={(value) =>
                onDropUpdate("items.base", value.uuid)}
        />

        <DropTag
            embeddedData={grant.items.base}
            type="item"
            onUpdateSelection={(value) => onUpdateValue("items.base", value)}
        />
    </Section>

    <Section heading="Optional Items" --a5e-section-margin="0.25rem 0">
        <DropArea
            type="uuid"
            documentType="Item"
            onDocumentDropped={(value) =>
                onDropUpdate("items.options", value.uuid)}
        />

        <DropTag
            embeddedData={grant.items.options}
            type="item"
            onUpdateSelection={(value) => onUpdateValue("items.options", value)}
        />
    </Section>

    <GrantConfig>
        <FieldWrapper heading="Total Count">
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={grant.items.total ?? 0}
                onchange={({ currentTarget }) =>
                    onUpdateValue("items.total", Number(currentTarget.value))}
            />
        </FieldWrapper>
    </GrantConfig>
</form>
