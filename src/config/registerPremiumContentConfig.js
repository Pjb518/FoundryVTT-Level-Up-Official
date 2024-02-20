export default function registerPremiumContentConfig(A5E) {
  A5E.premiumContent = {
    acesAdventuringGuides: {
      name: "Ace's Adventuring Guides",
      releases: [{
        title: "Ace's Guide to Necromancy",
        url: 'https://bit.ly/3TWSVkh'
      }]
    },
    anthonyAlipio: {
      name: 'Anthony Alipio',
      releases: [
        {
          title: 'The Sugar Crumb Fairy',
          url: 'https://bit.ly/3Zs8nI4'
        },
        {
          title: 'Til Undeath Do Us Part',
          url: 'https://bit.ly/3SBRDwn'
        }
      ]
    },
    dmSarah: {
      name: 'DM Sarah',
      releases: [{
        title: 'Stranger Sights: Challenges for 5e and Advanced 5e',
        url: 'https://bit.ly/3zR5Uf0'
      }]
    },
    enPublishing: {
      name: 'EN Publishing',
      releases: [{
        title: 'Memories of Holdenshire',
        url: 'https://bit.ly/3A8wlgq'
      }]
    },
    joshGentry: {
      name: 'Josh Gentry',
      releases: [
        {
          title: 'Crests of Destiny',
          url: 'https://bit.ly/3T1BE7O'
        },
        {
          title: 'Dose of Dungeonpunk - The Talos Heritage',
          url: 'https://bit.ly/3fe9CaB'
        },
        {
          title: 'Slice of Psionics - The Elan Heritage',
          url: 'https://bit.ly/3CDh3R1'
        }

      ]
    },
    plantWitchPress: {
      name: 'Plant Witch Press',
      releases: [{
        title: 'Toil and Trouble',
        url: 'https://bit.ly/3HE10VQ'
      }]
    },
    purpleMartinGames: {
      name: 'Purple Martin Games',
      releases: [
        {
          title: 'MoAR: Battlemages',
          url: 'https://bit.ly/41HQd4G'
        },
        {
          title: 'MoAR: Complete',
          url: 'https://bit.ly/4b7Fsyi'
        },
        {
          title: 'MoAR: Elements',
          url: 'https://bit.ly/3XIvKfE'
        },
        {
          title: 'MoAR: Intrigue',
          url: 'https://bit.ly/3uIMyFQ'
        },
        {
          title: 'MoAR: Light & Dark',
          url: 'https://bit.ly/3T9pQ3s'
        },
        {
          title: 'MoAR: Wilderness',
          url: 'https://bit.ly/3xisyKN'
        },
        {
          title: 'Thematic Toolkit: Folk of the Court',
          url: 'https://bit.ly/48SVn1R'
        },
        {
          title: 'Thematic Toolkit: Itinerant',
          url: 'https://bit.ly/3Sidh7p'
        }
      ]
    },
    roguesCollection: {
      name: "The Rogue's Collection",
      releases: [
        {
          title: 'Eclipsa Records - Armaments: Confidential',
          url: 'https://bit.ly/3Om8W1y'
        },
        {
          title: 'Legends of Strength',
          url: 'https://bit.ly/3UnXINY'
        },
        {
          title: 'Primal Sorcery',
          url: 'https://bit.ly/3SBPS24'
        }
      ]
    },
    rollThemBones: {
      name: 'Roll them Bones',
      releases: [{
        title: 'Extra Credit and Deeper Mysteries',
        url: 'https://bit.ly/47UnJaV'
      }]
    },
    speaksAndSpells: {
      name: 'Speaks & Spells Publishing',
      releases: [{
        title: 'The Arcane Exterminator: An Artificer Archetype and Magic Item Compendium',
        url: 'https://bit.ly/49fTzA3'
      }]
    },
    steampunkette: {
      name: 'Steampunkette',
      releases: [{
        title: 'Paranormal Power',
        url: 'https://bit.ly/49bS1XH'
      }]
    },
    wolfworksPress: {
      name: 'Wolfworks Press',
      releases: [{
        title: 'Handbook of Heritages',
        url: 'https://bit.ly/3PPfarX'
      }]
    }
  };

  A5E.products = {
    acesAdventuringGuideToNecromancy: {
      abbreviation: 'AAGtN',
      affiliate: true,
      publisher: 'acesAdventuringGuides',
      title: "Ace's Adventuring Guide to Necromancy",
      url: 'https://bit.ly/4bez8oK'
    },
    acesAdventuringGuideToNecromancySupplement: {
      abbreviation: 'AAGtN:S',
      affiliate: true,
      publisher: 'acesAdventuringGuides',
      title: "Ace's Adventuring Guide to Necromancy: A Supplement",
      url: 'https://bit.ly/3HQ17gV'
    },
    adventurersGuide: {
      abbreviation: 'AG',
      affiliate: true,
      publisher: 'enPublishing',
      title: "Level Up: Adventurer's Guide",
      url: 'https://bit.ly/3w15Iua'
    },
    adventuresInZeitgeist: {
      abbreviation: 'AiZ',
      affiliate: true,
      publisher: 'enPublishing',
      title: 'Level Up: Adventures in ZEITGEIST',
      url: 'https://bit.ly/3u99LnT'
    },
    doseOfDungeonpunk: {
      abbreviation: 'DOD:TH',
      affiliate: true,
      publisher: 'joshGentry',
      title: 'Dose of Dungeonpunk - The Talos Heritage',
      url: 'https://bit.ly/4bo5FsM'
    },
    dungeonDelversGuide: {
      abbreviation: 'DDG',
      affiliate: true,
      publisher: 'enPublishing',
      title: "Level Up: Dungeon Delver's Guide",
      url: 'https://bit.ly/3SrQmGC'
    },
    gpg0: {
      abbreviation: 'GPG #0',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #0',
      url: 'https://bit.ly/3HMhZW5'
    },
    gpg1: {
      abbreviation: 'GPG #1',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #1',
      url: 'https://bit.ly/48YR8BZ'
    },
    gpg2: {
      abbreviation: 'GPG #2',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #2',
      url: 'https://bit.ly/49hj181'
    },
    gpg3: {
      abbreviation: 'GPG #3',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #3',
      url: 'https://bit.ly/49elHTS'
    },
    gpg4: {
      abbreviation: 'GPG #4',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #4',
      url: 'https://bit.ly/4bo5Vbe'
    },
    gpg5: {
      abbreviation: 'GPG #5',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #5',
      url: 'https://bit.ly/3uuw1sx'
    },
    gpg6: {
      abbreviation: 'GPG #6',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #6',
      url: 'https://bit.ly/3SquHyB'
    },
    gpg7: {
      abbreviation: 'GPG #7',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #7',
      url: 'https://bit.ly/4bEHc2h'
    },
    gpg8: {
      abbreviation: 'GPG #8',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #8',
      url: 'https://bit.ly/3SNRHrB'
    },
    gpg9: {
      abbreviation: 'GPG #9',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #9',
      url: 'https://bit.ly/3OvH2k2'
    },
    gpg10: {
      abbreviation: 'GPG #10',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #10',
      url: 'https://bit.ly/42JSXR0'
    },
    gpg11: {
      abbreviation: 'GPG #11',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #11',
      url: 'https://bit.ly/3OsnMnu'
    },
    gpg12: {
      abbreviation: 'GPG #12',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #12',
      url: 'https://bit.ly/3uI2SKn'
    },
    gpg13: {
      abbreviation: 'GPG #13',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #13',
      url: 'https://bit.ly/3T1ABHU'
    },
    gpg14: {
      abbreviation: 'GPG #14',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #14',
      url: 'https://bit.ly/49kSzLo'
    },
    gpg15: {
      abbreviation: 'GPG #15',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #15',
      url: 'https://bit.ly/49kSzLo'
    },
    gpg19: {
      abbreviation: 'GPG #19',
      affiliate: true,
      publisher: 'enPublishing',
      series: 'gatePassGazette',
      title: 'Level Up: Gate Pass Gazette Issue #19',
      url: 'https://bit.ly/4blqODO'
    },
    heroesOldAndNew: {
      abbreviation: 'MMM',
      affiliate: false,
      publisher: 'rollThemBones',
      title: 'Heroes Old and New',
      url: 'https://bit.ly/3UevPrJ'
    },
    moarComplete: {
      abbreviation: 'MoAR',
      affiliate: true,
      publisher: 'purpleMartinGames',
      title: 'Manual of Adventurous Resources: Complete',
      url: 'https://bit.ly/4b7Fsyi'
    },
    monstrousMenagerie: {
      abbreviation: 'MM',
      affiliate: true,
      publisher: 'enPublishing',
      title: 'Level Up: Monstrous Menagerie',
      url: 'https://bit.ly/42nUNa0'
    },
    mortalist: {
      abbreviation: 'Mort',
      affiliate: true,
      publisher: 'purpleMartinGames',
      title: 'Mortalist',
      url: 'https://bit.ly/3I6n4Zj'
    },
    motifClasses: {
      abbreviation: 'SA:MC',
      affiliate: true,
      publisher: 'purpleMartinGames',
      title: 'System Architecture: Motif Classes',
      url: 'https://bit.ly/4bgzU4N'
    },
    mysteriousAndMarvelousMiscellanea: {
      abbreviation: 'MMM',
      affiliate: false,
      publisher: 'rollThemBones',
      title: 'Mysterious and Marvelous Miscellanea',
      url: 'https://bit.ly/42fLLM8'
    },
    secretsOfTheSelkies: {
      abbreviation: 'SotS',
      affiliate: false,
      publisher: 'speaksAndSpells',
      title: 'Secrets of the Selkies',
      url: ''
    },
    strangerSights: {
      abbreviation: 'SS',
      affiliate: true,
      publisher: 'dmSarah',
      title: 'Stranger Sights: Challenges for 5e and Advanced 5e',
      url: 'https://bit.ly/3SmPaEv'
    },
    toSaveAKingdom: {
      abbreviation: 'TSaK',
      affiliate: true,
      publisher: 'enPublishing',
      title: 'Level Up: To Save a Kingdom',
      url: 'https://bit.ly/42iQKvN'
    },
    trialsAndTreasures: {
      abbreviation: 'T&T',
      affiliate: true,
      publisher: 'enPublishing',
      title: 'Level Up: Trials and Treasures',
      url: 'https://bit.ly/3w8ha7b'
    }
  };
}
