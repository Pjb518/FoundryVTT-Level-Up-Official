import { ConditionManager } from '#managers/ConditionManager.ts';
import { indexCompendiaFields } from '#utils/db/indexCompendiaFields.ts';
// import registerConditionsConfig from "../config/registerConditionsConfig.ts";
import registerCustomCanvasLayers from '../config/registerCustomCanvasLayers.ts';
import registerExtraContentConfig from '../config/registerExtraContentConfig.ts';
import registerLogicRollFunctions from '../config/registerLogicRollFunctions.ts';
import registerSystemSettings from '../settings.ts';
import setupFancySheets from './setupFancySheets.ts';
import updateGMTitle from './updateGMTitle.ts';

export default async function setup() {
	await registerSystemSettings();
	registerLogicRollFunctions();
	// registerConditionsConfig();

	registerCustomCanvasLayers();
	registerExtraContentConfig();
	indexCompendiaFields();
	// setupFancySheets();
	updateGMTitle();

	// Setup Condition Manager
	const conditionManager = new ConditionManager();
	conditionManager.init();
	game.a5e.ConditionManager = conditionManager;

	conditionManager.configureStatusEffects();
}
