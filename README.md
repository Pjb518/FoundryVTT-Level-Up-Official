# FoundryVTT - Level Up: Advanced 5th Edition (Official)

![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/Pjb518/FoundryVTT-Level-Up-Official/releases/latest/download/system.json&color=blue)
![Latest Release Download Count](https://img.shields.io/github/downloads/Pjb518/FoundryVTT-Level-Up-Official/latest/a5e.zip)
[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fa5e&colorB=brightgreen)](https://forge-vtt.com/bazaar#package=a5e)
[![Discord](https://img.shields.io/discord/957965481455788032?label=A5e%20Foundry%20Discord)](https://discord.gg/XtkZ6RkN9E)

This is an official FoundryVTT system implementation for Level Up: Advanced 5th Edition.

The system is being *very* actively developed: it's very rare that we put out less than one release per week! If you want to keep up to date with the system's development and influence its future, definitely join our [community Discord server](https://discord.gg/XtkZ6RkN9E).

## Major Features

### Actions
A5e features, spells, maneuvers, and objects can each be configured with numerous "actions", each of which represents a different way to activate the item, with fully independent configuration. This makes it easy to configure a staff full of spells, weapons with different attack modes (like thrown weapons), and features with ongoing effects.

![Actions Demo](https://github.com/Pjb518/FoundryVTT-Level-Up-Official/blob/main/public/assets/github/actions.png)

### Active Effects
The A5e Effects system offers a rich interface for Active Effects including searchable, human-readable keys, selectable values, and baked in support for attribute references. You can even configure temporary damage and healing bonuses.

If you're used to using DAE, our Effects system does everything DAE does and more.

### Automation
The system's character sheets provide a number of pieces of handy automation, including bonus and armor class calculations, weight tracking, and resource consumption / restoration. The system also automatically grants features and benefits linked to various parts of character creation, such as your heritage, culture, and background.

Rolls in the system are also highly automated and can be modified post-hoc directly in the chat cards.

### Bonuses
The A5e system includes a fairly elaborate bonus system, with each bonus being configured with a specific context. This context dictates when a bonus should be applied. For example, an attack roll might apply specifically to melee and ranged spell attack rolls, but not weapon attack rolls. A skill bonus may apply only to skills using Strength or only the Acrobatics and Stealth skills.

Bonuses can be toggled on or off at roll time and the default state for this toggle can be configured on a per-bonus basis. So, if you have a damage bonus that only applies sometimes (like Sneak Attack), you can keep that toggled off until it's time to use it.

![Bonuses Demo](https://github.com/Pjb518/FoundryVTT-Level-Up-Official/blob/main/public/assets/github/bonuses.png)

### Compendium Packs
The A5e system includes comprehensive packs for both Level Up and D&D 5e content. The D&D 5e packs contain everything permitted by the [D&D 5e SRD 5.1](https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf), fully configured and ready to use. The A5e packs are much more extensive. The [LUSRD](https://a5esrd.com/a5esrd) permits almost all official game mechanical content published for Level Up to be included in the system packs, and we also include a great deal of third-party Level Up material licensed under the OGL. In total, our compendia contain over 7,500 documents.

We also have our own custom compendium sheets which are highly filterable, integrate directly with our character sheets, and can even be used to generate RollTables. They also provide handy summary information to help you better understand the compendium content at a glance.

![Fancy Compendium Packs Demo](https://github.com/Pjb518/FoundryVTT-Level-Up-Official/blob/main/public/assets/github/system-packs.png)

### Condition Tracking
When you have a token selected on the canvas, we provide an unobtrusive interface for tracking conditions and Active Effects affecting the selected token. You can also see a handy summary of the condition's effects by hovering over the icon or removes the condition by right clicking.

![Conditions Tracker Demo](https://github.com/Pjb518/FoundryVTT-Level-Up-Official/blob/main/public/assets/github/conditions-tracker.png)

### D&D 5E Support
In addition to including all of the D&D 5e SRD content in our system packs, the A5e system also provides a number of settings to better support standard 5e play or a partial adoption of the A5e rule set. Settings include the ability to hide expertise dice and A5e skills, use Exhaustion in place of A5e's Fatigue and Strife tracks, and use 5e's simpler Initiative and Death Saving Throw mechanics.

We're working hard to make 5e play in the A5e system even better, so please submit feature requests if there's something that will make your 5e games run more smoothly.

### Expanded Token HUD
Tokens in the A5e system make use an expanded token HUD that includes AC information, a beautiful conditions ring, and an updated conditions interface complete with generic markers.

![Token HUD Demo](https://github.com/Pjb518/FoundryVTT-Level-Up-Official/blob/main/public/assets/github/token-hud.png)

### Party Viewer
The system includes a detailed party viewer that allows you to view summary statistics for the whole party in a single window.

![Party Viewer Demo](https://github.com/Pjb518/FoundryVTT-Level-Up-Official/blob/main/public/assets/github/party-viewer.png)

Support for multiple parties coming soon!

## Funding

If you'd like to support the development of the Level Up: Advanced 5th Edition system for Foundry VTT, please consider becoming a patron. In addition to helping fund system development, patrons also get early access to system features and exclusive modules, such as our **[5e → A5e conversion tools](https://www.patreon.com/posts/preview-5e-a5e-89802245)** and **[Encounter Builder](https://www.patreon.com/posts/preview-builder-92995236)**. You can find our Patreon page page below.

[![Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3DForgemasterModules%26type%3Dpatrons&style=for-the-badge)](https://patreon.com/ForgemasterModules)

## Modules

In addition to the wealth of system agnostic modules available on Foundry, several modules have already been made specifically for Level Up. You can find a list of these packages [here](https://github.com/Pjb518/FoundryVTT-Level-Up-Official/wiki/Modules).

If you've developed a module for the Level Up system and would like it listed here, feel free to get in touch. You can find several ways to contact me in the `system.json`, or you can open a ticket if you'd prefer.

**Compatibility Note:** Level Up is not based on the 5e system implementation in Foundry and 5e-specific modules should not be expected to work.

## Licenses

This system is offered and may be used under the terms of the Open Gaming License v1.0a and the accompanying
Level Up: Advanced 5th Edition [Systems Reference Document](https://www.levelup5e.com/system-reference-document).

The content of the `public/packs/` is used under the terms of the Open Gaming License v1.0a. A copy of the license can be found in the `OGL.md` document.

Various icons are in the `public/assets/icons` directory are sourced from [game-icons.net](https://www.game-icons.net) and are licensed under CC BY 3.0 DEED. Attributions and license details are provided in the `LICENSE.md` file in that directory.

The logos in `public/assets/publisherLogos` are used with permission of the respective publishers.

The remaining images in the `public/assets/` directory are provided for non-commercial use by EN Publishing Inc. and can be found [here](https://www.enworld.org/newsimages/lu_monstrous_menagerie_tokens.zip).

The system software is distributed under the [MIT License](https://mit-license.org/).

---

This system was made with the help of [Svelte](https://svelte.dev/) and [TyphonJS](https://github.com/typhonjs-fvtt-lib/typhonjs).

[![68747470733a2f2f692e696d6775722e636f6d2f64784c635a724c2e6a7067](https://github.com/Pjb518/FoundryVTT-Level-Up-Official/assets/33249712/32006129-142e-43d1-8b7f-019a8cd1fc43)](https://github.com/typhonjs-fvtt-lib/typhonjs)
