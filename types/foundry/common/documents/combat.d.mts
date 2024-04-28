/**
 * @typedef {import("./_types.mjs").CombatData} CombatData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The Card Document.
 * Defines the DataSchema and common behaviors for a Combat which are shared between both client and server.
 * @mixes CombatData
 */
export default class BaseCombat extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        type: fields.DocumentTypeField;
        system: fields.TypeDataField;
        scene: fields.ForeignDocumentField;
        combatants: fields.EmbeddedCollectionField;
        active: fields.BooleanField;
        round: fields.NumberField;
        turn: fields.NumberField;
        sort: fields.IntegerSortField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /**
     * Is a user able to update an existing Combat?
     * @protected
     */
    protected static "__#18@#canUpdate"(user: any, doc: any, data: any): boolean;
    /**
     * Construct a Combat document using provided data and context.
     * @param {Partial<CombatData>} data              Initial data from which to construct the Combat
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<CombatData>, context: DocumentConstructionContext);
    /**
     * Can a certain User change the Combat round?
     * @param {User} user     The user attempting to change the round
     * @returns {boolean}     Is the user allowed to change the round?
     * @protected
     */
    protected _canChangeRound(user: User): boolean;
    /**
     * Can a certain User change the Combat turn?
     * @param {User} user     The user attempting to change the turn
     * @returns {boolean}     Is the user allowed to change the turn?
     * @protected
     */
    protected _canChangeTurn(user: User): boolean;
}
export type CombatData = import("./_types.mjs").CombatData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
