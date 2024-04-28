/**
 * @typedef {import("./_types.mjs").UserData} UserData
 * @typedef {import("../types.mjs").DocumentConstructionContext} DocumentConstructionContext
 */
/**
 * The User Document.
 * Defines the DataSchema and common behaviors for a User which are shared between both client and server.
 * @mixes UserData
 */
export default class BaseUser extends Document {
    /** @inheritdoc */
    static defineSchema(): {
        _id: fields.DocumentIdField;
        name: fields.StringField;
        role: fields.NumberField;
        password: fields.StringField;
        passwordSalt: fields.StringField;
        avatar: fields.FilePathField;
        character: fields.ForeignDocumentField;
        color: fields.ColorField;
        pronouns: fields.StringField;
        hotbar: fields.ObjectField;
        permissions: fields.ObjectField;
        flags: fields.ObjectField;
        _stats: fields.DocumentStatsField;
    };
    /**
     * Validate the structure of the User hotbar object
     * @param {object} bar      The attempted hotbar data
     * @return {boolean}
     * @private
     */
    private static "__#25@#validateHotbar";
    /**
     * Validate the structure of the User permissions object
     * @param {object} perms      The attempted permissions data
     * @return {boolean}
     * @private
     */
    private static "__#25@#validatePermissions";
    /**
     * Is a user able to create an existing User?
     * @param {BaseUser} user    The user attempting the creation.
     * @param {BaseUser} doc     The User document being created.
     * @param {object} data      The supplied creation data.
     * @private
     */
    private static "__#25@#canCreate";
    /**
     * Is a user able to update an existing User?
     * @param {BaseUser} user    The user attempting the update.
     * @param {BaseUser} doc     The User document being updated.
     * @param {object} changes   Proposed changes.
     * @private
     */
    private static "__#25@#canUpdate";
    /**
     * Is a user able to delete an existing User?
     * Only Assistants and Gamemasters can delete users, and only if the target user has a lesser or equal role.
     * @param {BaseUser} user   The user attempting the deletion.
     * @param {BaseUser} doc    The User document being deleted.
     * @private
     */
    private static "__#25@#canDelete";
    /**
     * Construct a User document using provided data and context.
     * @param {Partial<UserData>} data                Initial data from which to construct the User
     * @param {DocumentConstructionContext} context   Construction context options
     */
    constructor(data: Partial<UserData>, context: DocumentConstructionContext);
    /**
     * A convenience test for whether this User has the NONE role.
     * @type {boolean}
     */
    get isBanned(): boolean;
    /**
     * Test whether the User has a GAMEMASTER or ASSISTANT role in this World?
     * @type {boolean}
     */
    get isGM(): boolean;
    /**
     * Test whether the User is able to perform a certain permission action.
     * The provided permission string may pertain to an explicit permission setting or a named user role.
     * Alternatively, Gamemaster users are assumed to be allowed to take all actions.
     *
     * @param {string} action         The action to test
     * @return {boolean}              Does the user have the ability to perform this action?
     */
    can(action: string): boolean;
    /** @inheritdoc */
    getUserLevel(user: any): number;
    /**
     * Test whether the User has at least a specific permission
     * @param {string} permission    The permission name from USER_PERMISSIONS to test
     * @return {boolean}             Does the user have at least this permission
     */
    hasPermission(permission: string): boolean;
    /**
     * Test whether the User has at least the permission level of a certain role
     * @param {string|number} role    The role name from USER_ROLES to test
     * @param {boolean} [exact]       Require the role match to be exact
     * @return {boolean}              Does the user have at this role level (or greater)?
     */
    hasRole(role: string | number, { exact }?: boolean): boolean;
}
export type UserData = import("./_types.mjs").UserData;
export type DocumentConstructionContext = import("../types.mjs").DocumentConstructionContext;
import Document from "../abstract/document.mjs";
import * as fields from "../data/fields.mjs";
