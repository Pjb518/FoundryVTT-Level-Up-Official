export default function registerExtraContentConfig() {
  const { A5E } = CONFIG;

  if (game.settings.get("a5e", "showVRCSpecialties")) {
    //Arcana
    delete CONFIG.A5E.skillSpecialties.arc.psionics;
    delete CONFIG.A5E.skillSpecialties.arc.psionicItems;
    delete CONFIG.A5E.skillSpecialties.arc.psionicCreatures;

    //Athletics
    delete CONFIG.A5E.skillSpecialties.ath.zeroG;

    //Engineering
    delete CONFIG.A5E.skillSpecialties.eng.robotics;
    delete CONFIG.A5E.skillSpecialties.eng.starships;
    delete CONFIG.A5E.skillSpecialties.eng.starshipEngines;
    delete CONFIG.A5E.skillSpecialties.eng.starshipShields;

    //Investigation
    delete CONFIG.A5E.skillSpecialties.inv.sensors

    //Medicine
    delete CONFIG.A5E.skillSpecialties.med.xenobiology;

    //Survival
    delete CONFIG.A5E.skillSpecialties.sur.astrogation;
  }
  
  if (game.settings.get("a5e", "showVRCProficiencies")) {
    //Languages
    delete CONFIG.A5E.languages.machine;

    //Tools
    delete CONFIG.A5E.tools.vehicles.spaceVehicles;
    delete CONFIG.A5E.tools.miscellaneous.computers;
    delete CONFIG.A5E.tools.miscellaneous.hackingTool;

    //Weapons
    delete CONFIG.A5E.weapons.simple.blaster;
    delete CONFIG.A5E.weapons.simple.joltPistol;
    delete CONFIG.A5E.weapons.simple.slugger;
    delete CONFIG.A5E.weapons.martial.hypodermicPistol;
    delete CONFIG.A5E.weapons.martial.pulseRifle;
    delete CONFIG.A5E.weapons.martial.slugRifle;
    delete CONFIG.A5E.weapons.martial.sniperRifle;
    delete CONFIG.A5E.weapons.miscellaneous.starship;
  }
  
  return
}
