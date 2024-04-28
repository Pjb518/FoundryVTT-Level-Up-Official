/**
 * @typedef {import("./_types.mjs").CombatantData} CombatantData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Combatant Document.
 * Defines the DataSchema and common behaviors for a Combatant which are shared between both client and server.
 * @mixes CombatantData
 */
export default class BaseCombatant extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        type: fields.DocumentTypeField;
        system: fields.TypeDataField;
        actorId: fields.ForeignDocumentField;
        tokenId: fields.ForeignDocumentField;
        sceneId: fields.ForeignDocumentField;
        name: fields.StringField;
        img: fields.FilePathField;
        initiative: fields.NumberField;
        hidden: fields.BooleanField;
        defeated: fields.BooleanField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /**
     * Is a user able to update an existing Combatant?
     * @private
     */
    private static "__#19@#canUpdate";
    /**
     * Is a user able to create this Combatant?
     * @private
     */
    private static "__#19@#canCreate";
    /**
     * Construct a Combatant document using provided data and context.
     * @param {Partial<CombatantData>} data           Initial data from which to construct the Combatant
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<CombatantData>, context: DocumentConstructionContext);
}
export type CombatantData = import("./_types.mjs").CombatantData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
