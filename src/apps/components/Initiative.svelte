<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import rollInitiative from "../handlers/rollInitiative";

    export let actor;
</script>

<li class="initiative-container">
    <h4 class="initiative-heading">{localize("A5E.Initiative")}</h4>

    <i
        class="initiative-roll-button fas fa-dice-d20"
        on:click={() => rollInitiative($actor)}
    />

    <!-- <div
        v-if="!sheetIsLocked"
        class="a5e-ability-score__buttons u-justify-center"
    >
        <i
            class="a5e-config-button fas fa-cog"
            title="Configure Initiative Bonuses"
            @click="onClickConfigButton"
        />
    </div> -->
</li>

<style lang="scss">
    .initiative {
        &-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            background: rgba(0, 0, 0, 0.05);
            font-family: "Modesto Condensed", serif;
            border-radius: 3px;
            width: 100%;
            height: 100%;
        }

        &-heading {
            font-size: 1.2rem;
        }

        &-roll-button {
            display: flex;
            align-items: center;
            flex-grow: 1;
            color: #7e7960;
            font-size: 1.44rem;
            cursor: pointer;
            margin-bottom: 1.2rem;

            transition: all 0.15s ease-in-out;

            &:hover {
                transform: scale(1.2);
                color: inherit;
            }
        }
    }
</style>
