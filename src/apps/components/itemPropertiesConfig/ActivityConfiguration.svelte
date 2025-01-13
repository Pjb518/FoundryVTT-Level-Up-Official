<script>
import { getContext } from 'svelte';
import { localize } from '#runtime/util/i18n';

import Checkbox from '../Checkbox.svelte';
import FieldWrapper from '../FieldWrapper.svelte';
import RadioGroup from '../RadioGroup.svelte';

import updateDocumentDataFromField from '../../../utils/updateDocumentDataFromField';
import Section from '../Section.svelte';

const item = getContext('item');
const appId = getContext('appId');
const { activityTypes } = CONFIG.A5E;

let editMode = false;
</script>

<Section
    heading="A5E.TabActivityProperties"
    headerButtons={[
        {
            classes: `fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <RadioGroup
            heading="A5E.ActivityTypePrompt"
            options={Object.entries(activityTypes)}
            selected={$item.system.activityType}
            allowDeselect={true}
            on:updateSelection={(event) =>
                updateDocumentDataFromField($item, "system.activityType", event.detail)}
        />

        {#if ["journey"].includes($item.system.activityType)}
            <FieldWrapper
                heading="Critical Failure"
            >
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={$item.system.journeyProperties.criticalFailure || ""}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.journeyProperties.criticalFailure",
                            target.value,
                        )}
                />
            </FieldWrapper>

            <FieldWrapper
                heading="Failure"
            >
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={$item.system.journeyProperties.failure || ""}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.journeyProperties.failure",
                            target.value,
                        )}
                />
            </FieldWrapper>

            <FieldWrapper
                heading="Success"
            >
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={$item.system.journeyProperties.success || ""}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.journeyProperties.success",
                            target.value,
                        )}
                />
            </FieldWrapper>

            <FieldWrapper
                heading="Critical Success"
            >
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={$item.system.journeyProperties.criticalSuccess || ""}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.journeyProperties.criticalSuccess",
                            target.value,
                        )}
                />
            </FieldWrapper>
        {/if}
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.ActivityTypePrompt")}:
                </dt>

                <dd class="u-m-0 u-p-0">
                    {localize(activityTypes[$item.system.activityType]) ?? localize("A5E.None")}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
