export default function getToolProficiencies(data) {
  const toolProficiencies = data.data.proficiencies.tools.reduce((acc, curr) => {
    let tool;

    /* eslint-disable no-restricted-syntax */
    for (const toolType of ['artisansTools', 'gamingSets', 'musicalInstruments', 'miscellaneous', 'vehicles']) {
      if (CONFIG.A5E.toolsPlural[toolType][curr]) {
        tool = game.i18n.localize(CONFIG.A5E.toolsPlural[toolType][curr]);
        break;
      }
    }

    acc.push(tool || curr);
    return acc;
  }, []);

  toolProficiencies.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return toolProficiencies;
}
