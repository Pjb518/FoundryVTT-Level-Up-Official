<script lang="ts">
    import type { HomebrewPath } from "#utils/applyHomebrewEntries.ts";

    import { localize } from "#utils/localization/localize.ts";
    import {
        addConfigEntries,
        getExistingKeys,
        getHomebrewBucket,
        normalizeHomebrewContent,
        removeConfigEntry,
    } from "#utils/applyHomebrewEntries.ts";

    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    import HomebrewEntryList from "./HomebrewEntryList.svelte";

    const simpleSections: { path: HomebrewPath; heading: string }[] = [
        { path: "damageTypes", heading: "A5E.settings.homebrew.damageTypes" },
        { path: "languages", heading: "A5E.settings.homebrew.languages" },
        { path: "objectTypes", heading: "A5E.settings.homebrew.objectTypes" },
        {
            path: "spellSchools.primary",
            heading: "A5E.settings.homebrew.primarySpellSchools",
        },
        {
            path: "spellSchools.secondary",
            heading: "A5E.settings.homebrew.secondarySpellSchools",
        },
    ];

    const proficiencyTypes: [string, string][] = [
        ["armor", "A5E.settings.homebrew.armor"],
        ["weapon", "A5E.settings.homebrew.weapon"],
        ["tool", "A5E.settings.homebrew.tool"],
        ["tradition", "A5E.settings.homebrew.tradition"],
    ];

    function persist() {
        return game.settings.set(
            "a5e",
            "homebrewContent",
            $state.snapshot(content),
        );
    }

    async function addEntries(
        path: HomebrewPath,
        labels: string[],
        category?: string,
    ): Promise<boolean> {
        const existing = getExistingKeys(path);
        const added: Record<string, string> = {};

        for (const label of labels) {
            const key = label.slugify({ strict: true });

            if (!key || existing.has(key.toLowerCase())) {
                ui.notifications.warn(
                    localize("A5E.settings.homebrewDuplicate", { label }),
                );
                continue;
            }

            existing.add(key.toLowerCase());
            added[key] = label;
        }

        if (!Object.keys(added).length) return false;

        Object.assign(getHomebrewBucket(content, path, category, true), added);
        addConfigEntries(path, added, category);
        await persist();

        return true;
    }

    function removeEntry(path: HomebrewPath, key: string, category?: string) {
        delete getHomebrewBucket(content, path, category)[key];
        removeConfigEntry(path, key, category);
        persist();
    }

    let content = $state(
        normalizeHomebrewContent(game.settings.get("a5e", "homebrewContent")),
    );

    let open: Record<string, boolean> = $state({});
    let proficiencyType = $state("");
    let proficiencyCategory = $state("");

    let proficiencyPath = $derived(
        proficiencyType
            ? (`proficiencies.${proficiencyType}` as HomebrewPath)
            : null,
    );

    let categories: [string, string][] = $derived(
        proficiencyType === "weapon"
            ? Object.entries(CONFIG.A5E.weaponCategories)
            : proficiencyType === "tool"
              ? Object.entries(CONFIG.A5E.toolCategories)
              : [],
    );

    let needsCategory = $derived(categories.length > 0);
    let proficiencyReady = $derived(
        !!proficiencyPath && (!needsCategory || !!proficiencyCategory),
    );

    let proficiencyEntries = $derived(
        proficiencyReady
            ? getHomebrewBucket(
                  content,
                  proficiencyPath!,
                  proficiencyCategory || undefined,
              )
            : {},
    );
</script>

<main class="a5e-homebrew">
    {#each simpleSections as { path, heading } (path)}
        <Section
            {heading}
            headerButtons={[
                {
                    classes: "add-button",
                    handler: () => (open[path] = !open[path]),
                    htmlString: open[path]
                        ? '<i class="fa-solid fa-minus"></i>'
                        : '<i class="fa-solid fa-plus"></i>',
                },
            ]}
            --a5e-section-body-gap="0.5rem"
        >
            <HomebrewEntryList
                entries={getHomebrewBucket(content, path)}
                open={!!open[path]}
                onAdd={(labels) => addEntries(path, labels)}
                onRemove={(key) => removeEntry(path, key)}
            />
        </Section>
    {/each}

    <Section
        heading="A5E.settings.homebrew.proficiencies"
        --a5e-section-body-gap="0.5rem"
    >
        <RadioGroup
            options={proficiencyTypes}
            selected={proficiencyType}
            onUpdateSelection={(value) => {
                proficiencyType = value;
                proficiencyCategory = "";
            }}
        />

        {#if needsCategory}
            <RadioGroup
                heading="A5E.settings.homebrew.category"
                options={categories}
                selected={proficiencyCategory}
                onUpdateSelection={(value) => (proficiencyCategory = value)}
            />
        {/if}

        {#if proficiencyReady}
            <HomebrewEntryList
                entries={proficiencyEntries}
                open
                onAdd={(labels) =>
                    addEntries(
                        proficiencyPath!,
                        labels,
                        proficiencyCategory || undefined,
                    )}
                onRemove={(key) =>
                    removeEntry(
                        proficiencyPath!,
                        key,
                        proficiencyCategory || undefined,
                    )}
            />
        {/if}
    </Section>
</main>

<style lang="scss">
    .a5e-homebrew {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem 0.5rem;
    }
</style>
