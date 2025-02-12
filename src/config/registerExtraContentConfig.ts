// @ts-nocheck

export default function registerExtraContentConfig() {
	if (game.settings.get('a5e', 'usePoSTables')) {
		const { skillCriticalTables, skillFumbleTables } = CONFIG.A5E;

		skillCriticalTables.acr = 'Compendium.a5e.a5e-roll-tables.RollTable.nQgWBIDmfv5cIa13';
		skillCriticalTables.ani = 'Compendium.a5e.a5e-roll-tables.RollTable.xlS2dgOxYf3H7nVl';
		skillCriticalTables.arc = 'Compendium.a5e.a5e-roll-tables.RollTable.S7o3yy5f7eVNxBDa';
		skillCriticalTables.ath = 'Compendium.a5e.a5e-roll-tables.RollTable.rFCXQNq4MFE7yMhU';
		skillCriticalTables.cul = 'Compendium.a5e.a5e-roll-tables.RollTable.JoW2tXQ8an2VoSfP';
		skillCriticalTables.dec = 'Compendium.a5e.a5e-roll-tables.RollTable.oNsPMgKkP6BxkrgD';
		skillCriticalTables.eng = 'Compendium.a5e.a5e-roll-tables.RollTable.v00K9SPW7JakZMc4';
		skillCriticalTables.his = 'Compendium.a5e.a5e-roll-tables.RollTable.EUXzA5HLIn1FcQtc';
		skillCriticalTables.ins = 'Compendium.a5e.a5e-roll-tables.RollTable.JSY64qB42PUqBBsf';
		skillCriticalTables.itm = 'Compendium.a5e.a5e-roll-tables.RollTable.JItFuDa3C9nslCa7';
		skillCriticalTables.inv = 'Compendium.a5e.a5e-roll-tables.RollTable.I6ktAe7Fkll2jT49';
		skillCriticalTables.nat = 'Compendium.a5e.a5e-roll-tables.RollTable.4ktCEwiJpdZlodTN';
		skillCriticalTables.prc = 'Compendium.a5e.a5e-roll-tables.RollTable.wVMyZ18O5JuWivyZ';
		skillCriticalTables.prf = 'Compendium.a5e.a5e-roll-tables.RollTable.l5w3Kur235oIuR5v';
		skillCriticalTables.per = 'Compendium.a5e.a5e-roll-tables.RollTable.OguIVpK0iR6yDR0H';
		skillCriticalTables.rel = 'Compendium.a5e.a5e-roll-tables.RollTable.0Rdtu6kwgXdgVxUw';
		skillCriticalTables.slt = 'Compendium.a5e.a5e-roll-tables.RollTable.ukvGTB3zMQybGxUn';
		skillCriticalTables.ste = 'Compendium.a5e.a5e-roll-tables.RollTable.Rkm2z7COADeuaYhA';
		skillCriticalTables.sur = 'Compendium.a5e.a5e-roll-tables.RollTable.ZNaOS1ZDCqaNILMi';

		skillFumbleTables.acr = 'Compendium.a5e.a5e-roll-tables.RollTable.UsdLGLn8EQcVQwIR';
		skillFumbleTables.ani = 'Compendium.a5e.a5e-roll-tables.RollTable.blUmKUeCxg1J6nXF';
		skillFumbleTables.arc = 'Compendium.a5e.a5e-roll-tables.RollTable.3VVAhfTwGX58kfEM';
		skillFumbleTables.ath = 'Compendium.a5e.a5e-roll-tables.RollTable.wAceuV0QNDtW9oTB';
		skillFumbleTables.cul = 'Compendium.a5e.a5e-roll-tables.RollTable.20b2ITjg9RD8MFPq';
		skillFumbleTables.dec = 'Compendium.a5e.a5e-roll-tables.RollTable.dBZjn9fS2arvsrFI';
		skillFumbleTables.eng = 'Compendium.a5e.a5e-roll-tables.RollTable.F0HHReRNyZuTZNrl';
		skillFumbleTables.his = 'Compendium.a5e.a5e-roll-tables.RollTable.6YFllTxs4ThnAF9A';
		skillFumbleTables.ins = 'Compendium.a5e.a5e-roll-tables.RollTable.Ij3L3AkAfBgRwFLv';
		skillFumbleTables.itm = 'Compendium.a5e.a5e-roll-tables.RollTable.uUyFLGzqpelpa1D7';
		skillFumbleTables.inv = 'Compendium.a5e.a5e-roll-tables.RollTable.XZqlb3n0qLXxPgRy';
		skillFumbleTables.nat = 'Compendium.a5e.a5e-roll-tables.RollTable.OMTuGDpDuzQ1pYNB';
		skillFumbleTables.prc = 'Compendium.a5e.a5e-roll-tables.RollTable.V2scZ09pcQLxv3c2';
		skillFumbleTables.prf = 'Compendium.a5e.a5e-roll-tables.RollTable.Sw1e8IOLnU6bzFxv';
		skillFumbleTables.per = 'Compendium.a5e.a5e-roll-tables.RollTable.nnAjoe1MOBFwSBGO';
		skillFumbleTables.rel = 'Compendium.a5e.a5e-roll-tables.RollTable.3UMKOuQBuzIiiY64';
		skillFumbleTables.slt = 'Compendium.a5e.a5e-roll-tables.RollTable.pjczjvOKqGzl5Edv';
		skillFumbleTables.ste = 'Compendium.a5e.a5e-roll-tables.RollTable.jerowwtP3cCB9jo5';
		skillFumbleTables.sur = 'Compendium.a5e.a5e-roll-tables.RollTable.Nxxt9SQzhOozULTs';
	}

	if (!game.settings.get('a5e', 'showVRCSpecialties')) {
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
		delete CONFIG.A5E.skillSpecialties.inv.sensors;

		//Medicine
		delete CONFIG.A5E.skillSpecialties.med.xenobiology;

		//Survival
		delete CONFIG.A5E.skillSpecialties.sur.astrogation;
	}

	if (!game.settings.get('a5e', 'showVRCProficiencies')) {
		//Combat Traditions
		delete CONFIG.A5E.maneuverTraditions.aceStarfighter;
		delete CONFIG.A5E.maneuverTraditions.blazingStarglaive;
		delete CONFIG.A5E.maneuverTraditions.mindfulBody;

		//Languages
		delete CONFIG.A5E.languages.machine;

		//Tools
		delete CONFIG.A5E.tools.vehicles.spaceVehicles;
		delete CONFIG.A5E.tools.miscellaneous.computers;
		delete CONFIG.A5E.tools.musicalInstruments.acousticGuitar;
		delete CONFIG.A5E.tools.musicalInstruments.electricGuitar;
		delete CONFIG.A5E.tools.musicalInstruments.harmonica;
		delete CONFIG.A5E.tools.musicalInstruments.keytar;
		delete CONFIG.A5E.tools.musicalInstruments.saxophone;
		delete CONFIG.A5E.tools.musicalInstruments.theremin;
		delete CONFIG.A5E.tools.specialist;

		//Weapons
		//Simple
		delete CONFIG.A5E.weapons.simple.blaster;
		delete CONFIG.A5E.weapons.simple.joltPistol;
		delete CONFIG.A5E.weapons.simple.laserPistol;
		delete CONFIG.A5E.weapons.simple.slugger;
		delete CONFIG.A5E.weapons.simple.shockMace;
		delete CONFIG.A5E.weapons.simple.sonicMaul;
		delete CONFIG.A5E.weapons.simple.stunStick;
		delete CONFIG.A5E.weapons.simple.tacticalBaton;

		//Martial
		delete CONFIG.A5E.weapons.martial.battleGauntlet;
		delete CONFIG.A5E.weapons.martial.bioChakram;
		delete CONFIG.A5E.weapons.martial.combatChainsaw;
		delete CONFIG.A5E.weapons.martial.combatKnife;
		delete CONFIG.A5E.weapons.martial.duelingSword;
		delete CONFIG.A5E.weapons.martial.electroHalberd;
		delete CONFIG.A5E.weapons.martial.electroHalberd;
		delete CONFIG.A5E.weapons.martial.energyCrossbow;
		delete CONFIG.A5E.weapons.martial.flameBracer;
		delete CONFIG.A5E.weapons.martial.flamethrower;
		delete CONFIG.A5E.weapons.martial.grenadeLauncher;
		delete CONFIG.A5E.weapons.martial.hypodermicPistol;
		delete CONFIG.A5E.weapons.martial.ionCannon;
		delete CONFIG.A5E.weapons.martial.longspear;
		delete CONFIG.A5E.weapons.martial.monoWhip;
		delete CONFIG.A5E.weapons.martial.netcaster;
		delete CONFIG.A5E.weapons.martial.plasmaSword;
		delete CONFIG.A5E.weapons.martial.polaronGatlingGun;
		delete CONFIG.A5E.weapons.martial.pulseRifle;
		delete CONFIG.A5E.weapons.martial.shotgun;
		delete CONFIG.A5E.weapons.martial.slugRifle;
		delete CONFIG.A5E.weapons.martial.sniperRifle;
		delete CONFIG.A5E.weapons.martial.tkGauntlet;
		delete CONFIG.A5E.weapons.martial.vibroknife;
		delete CONFIG.A5E.weapons.martial.viperRetainer;

		//Misc
		delete CONFIG.A5E.weapons.miscellaneous.starship;
	}

	return;
}
