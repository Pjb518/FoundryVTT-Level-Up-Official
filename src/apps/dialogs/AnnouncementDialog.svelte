<article class="main-announcement-container">
    <h2 class="announcement-section-heading">New Content Bundles!</h2>

    <p>
        For those of you looking to dip your toes into some of A5e's excellent third-party
        content, there are now <a
            href="https://www.drivethrurpg.com/en/browse?ruleSystem=1000104&format=45305&affiliate_id=1388381"
            target="_blank">four discounted bundles</a
        > available on DriveThruRPG for a limited time, each of which contains a selection
        of the community's favourite releases.
    </p>

    <p>
        If you already have some of the excellent titles included in these compilations,
        you won't be charged for any books you already own, so these bundles are still a
        great way to round out your collection.
    </p>

    <section class="product-cards">
        <a
            class="product-card"
            href="https://www.drivethrurpg.com/en/product/479335/a5e-archetypes-and-accessories-bundle?affiliate_id=1388381"
            target="_blank"
        >
            <img
                src="systems/a5e/assets/announcements/archetypes-bundle.webp"
                alt="Archetypes Bundle"
            />
            <p class="price">$15.99 <span class="price__old">$19.99</span></p>
        </a>

        <a
            class="product-card"
            href="https://www.drivethrurpg.com/en/product/479366/a5e-new-classes-bundle-bundle?affiliate_id=1388381"
            target="_blank"
        >
            <img
                src="systems/a5e/assets/announcements/classes-bundle.webp"
                alt="Classes Bundle"
            />
            <p class="price">$72.00 <span class="price__old">$89.99</span></p>
        </a>

        <a
            class="product-card"
            href="https://www.drivethrurpg.com/en/product/479369/a5e-premium-heritages-bundle?affiliate_id=1388381"
            target="_blank"
        >
            <img
                src="systems/a5e/assets/announcements/heritages-bundle.webp"
                alt="Heritages Bundle"
            />
            <p class="price">$35.60 <span class="price__old">$43.00</span></p>
        </a>

        <a
            class="product-card"
            href="https://www.drivethrurpg.com/en/product/479367/a5e-rules-expansions-bundle?affiliate_id=1388381"
            target="_blank"
        >
            <img
                src="systems/a5e/assets/announcements/rules-bundle.webp"
                alt="Archetypes Bundle"
            />
            <p class="price">$53.99 <span class="price__old">$64.99</span></p>
        </a>
    </section>

    <p>
        One final note: if you've made any purchases recently on DriveThru, make sure to
        leave a rating or a review. It really helps our wonderful third-party publishers
        out. You can quickly leave a rating on all of your unrated products by going to <a
            href="https://www.drivethrurpg.com/account_orders_uncommented.php"
            target="_blank">this page</a
        >.
    </p>

    <aside class="disclaimer">
        <strong>Disclaimer.</strong> This post contains affiliate links. If you choose to purchase
        any of the products listed here, we may receive a small amount of kick back from DriveThru
        RPG that will help fund further system and module development. This cut is taken from
        DriveThru's share, not the money that goes to the authors.
    </aside>
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
        font-weight: bold;
    }

    .button-hint {
        font-size: var(--a5e-text-size-xs);
        padding: 0.125rem;
        line-height: 1;
        margin: 0 0.125rem;
        color: var(--color-text-light-heading);
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid var(--color-border-dark-secondary);
        border-radius: var(--a5e-border-radius-standard);

        &--letter-key {
            padding-inline: 0.25rem;
        }
    }

    .disclaimer {
        margin-block: 1rem 0.25rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.833rem;
        background: hsl(0, 0%, 90%);
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .main-announcement-container {
        padding: 0.75rem;
    }

    .price {
        margin-block: 0.25rem;
        font-size: 1rem;
        color: inherit;
        text-align: center;

        &__old {
            text-decoration: line-through;
            color: #7c1615;
        }
    }

    .product-cards {
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(4, 1fr);
        margin-block: 1rem;
    }

    .product-card {
        border-radius: 8px;
        color: black;
        transition: all 0.15s ease-in-out;
        overflow: hidden;
        background: #fdfdfd;
        padding-bottom: 0.25rem;

        &:hover {
            transform: scale(1.03);
            text-shadow: none;
        }
    }

    p:not(:last-child) {
        margin-bottom: 0.375rem;
    }

    a {
        text-decoration: none;
    }
</style>
