<script>
    function applyDamage(multiplier = 1) {
        const { character } = game.user;
        const selectedTokens = canvas.tokens.controlled;
        const damage = roll.total * multiplier;

        if (selectedTokens.length)
            selectedTokens.forEach((t) => t.actor.applyDamage(damage));
        else if (character) character.applyDamage(damage);
        else ui.notifications.warn("No tokens selected");
    }

    async function applyHealing(healingType) {
        const { character } = game.user;
        const selectedTokens = canvas.tokens.controlled;

        if (selectedTokens.length) {
            selectedTokens.forEach((t) => {
                t.actor.applyHealing(roll.total, {
                    temp: healingType !== "healing",
                });
            });
        } else if (character) {
            character.applyHealing(roll.total, {
                temp: healingType !== "healing",
            });
        } else {
            ui.notifications.warn("No tokens selected");
        }
    }
</script>
