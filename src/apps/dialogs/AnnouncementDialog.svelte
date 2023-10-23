<article class="main-announcement-container">
    <p>Welcome to the A5e Foundry system!</p>

    <p>
        It's been a while since we've done one of these in-system announcements,
        but a lot has changed recently, and I think it's worth updating everyone
        on some current and upcoming features.
    </p>

    <section class="announcement-section">
        <header>
            <h3 class="announcement-section-heading">
                <i class="fa-brands fa-patreon" />
                Patreon
            </h3>
        </header>

        <p>
            First of all, we now have a <a
                href="https://www.patreon.com/ForgemasterModules"
                target="_blank">Patreon page</a
            >!
        </p>

        <p>
            This is part of an effort to streamline donations to the system,
            which were previously being split between several user accounts and
            platforms. As part of our move to Patreon, we've also begun offering
            Patreon exclusive modules to our patrons, including a set of
            <a
                href="https://www.patreon.com/posts/5e-a5e-tools-89802245"
                target="_blank">conversion tools</a
            > for getting content from a 5e Foundry world into one using A5e.
        </p>

        <p>
            Our latest module provides a set of
            <a
                href="https://www.patreon.com/posts/preview-of-our-90869285"
                target="_blank"
            >
                new compendium sheets
            </a>
            that include powerful filters, as well as summary details for each document.
            These new sheets will be rolled into the core system towards the end
            of November.
        </p>

        <img
            class="announcement-image announcement-image--full"
            src="systems/a5e/assets/announcements/fancy-compendium-preview.webp"
            alt="A preview of the Fancy Compendium Sheets module"
        />
    </section>

    <section class="announcement-section">
        <header>
            <h3 class="announcement-section-heading">
                <i class="fa-brands fa-d-and-d" />
                D&D 5e Support
            </h3>
        </header>

        <p>
            Next up, we've been expanding our support for D&D 5e in the system,
            and you'll start to see more and more 5e-specific settings in the
            coming weeks.
        </p>

        <p>
            We've also just released a set of 5e compendium packs that come
            baked into the A5e system. At the time of writing, we don't yet have
            a pack for 5e adventuring gear or magic items, but these will be
            coming soon.
        </p>
    </section>

    <section class="announcement-section">
        <header>
            <h3 class="announcement-section-heading">
                <i class="fa-solid fa-users" />
                The Party Viewer
            </h3>
        </header>

        <p>
            The system now includes a special interface for keeping track of
            your party's key statistics and resources. There's a button to
            access this interface on the left side of your screen (<i
                class="button-hint fa-solid fa-users"
            />), and can also quickly toggle the Party Viewer by pressing the
            <i class="button-hint button-hint--letter-key fa-solid fa-p" />
            key.
        </p>

        <p>
            Below you can see the Party Viewer showcasing my own party, familiar
            and all!
        </p>

        <img
            class="announcement-image announcement-image--full"
            src="systems/a5e/assets/announcements/party-viewer-preview.webp"
            alt="Party Viewer Preview"
        />
    </section>

    <section class="announcement-section">
        <header>
            <h3 class="announcement-section-heading">
                <i class="fa-solid fa-person-rays" />
                The Effects Panel
            </h3>
        </header>

        <p>
            We've added a handy effects interface to keep track of the effects
            affecting a given token. This includes both temporary Active Effects
            and conditions. Conditions automatically include a handy summary of
            the relevant rules when you hover over an icon in the panel.
        </p>

        <img
            class="announcement-image announcement-image--full"
            src="systems/a5e/assets/announcements/effects-interface-preview.webp"
            alt="Effects Interface Preview"
        />
    </section>

    <section class="announcement-section">
        <header>
            <h3 class="announcement-section-heading">
                <i class="fa-solid fa-message" />
                Chat Card Improvements
            </h3>
        </header>

        <p>
            We've made a number of improvements to the chat cards recently. You
            can now modify rolls that are already in the chat by clicking the
            dice button next to the roll in the chat card. This will allow you
            to retroactively apply advantage / disadvantage or change the
            expertise die size for a given roll.
        </p>

        <p>
            The chat now also includes a handy crit toggle for cases where crits
            are negated or where you get a critical hit without hitting your
            usual critical hit threshold.
        </p>
    </section>

    <section class="announcement-section">
        <header>
            <h3 class="announcement-section-heading">
                <i class="fa-brands fa-discord" />
                Join our Discord Server
            </h3>
        </header>

        <p>
            If you want to keep up to date with the latest developments,
            definitely <a href="https://discord.gg/U3PtYfPKb2" target="_blank"
                >join our Discord server</a
            >. It's also the best place to get help and support if you need it.
        </p>

        <p>
            Our server is also home to almost all of the A5e third-party
            publishers, so it's also a great place to keep up to date with Level
            Up's vibrant 3PP scene.
        </p>
    </section>
</article>

<style lang="scss">
    :global(.a5e-sheet--announcement) {
        max-height: 90vh;
        overflow: hidden;
    }

    :global(.a5e-sheet--announcement main) {
        height: 100%;
        overflow-y: auto;
    }

    .announcement-image {
        border-radius: 4px;

        &--full {
            height: auto;
            width: 100%;
        }
    }

    .announcement-section {
        margin-block: 0.75rem;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .announcement-section-heading {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        margin-bottom: 0.375rem;
        padding-inline: 0.125rem;
        font-weight: bold;
    }

    .button-hint {
        font-size: $font-size-xs;
        padding: 0.125rem;
        line-height: 1;
        margin: 0 0.125rem;
        color: var(--color-text-light-heading);
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid var(--color-border-dark-secondary);
        border-radius: 3px;

        &--letter-key {
            padding-inline: 0.25rem;
        }
    }

    .main-announcement-container {
        padding: 0.5rem;
    }

    p:not(:last-child) {
        margin-bottom: 0.375rem;
    }

    a {
        text-decoration: none;
    }
</style>
