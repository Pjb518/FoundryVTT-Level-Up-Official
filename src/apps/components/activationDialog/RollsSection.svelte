<script>
    const rollHeadingMap = {
        abilityCheck: "Ability Checks",
        damage: "Damage Rolls",
        generic: "Generic Rolls",
        healing: "Healing Rolls",
        savingThrow: "Saving Throws",
        skillCheck: "Skill Checks",
        toolCheck: "Tool Checks",
    };

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ]
    );
</script>

<style lang="scss">
</style>
