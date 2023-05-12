/**
 * The key used to store the history state in the application state object.
 */

export const HISTORY_STATE_KEY = 'ngUndoState';

/**
 * A prefix used to identify actions related to the NgUndo reducer.
 *
 * @constant
 * @name UNDO_REDUCER_PREFIX
 * @type {string}
 *
 * @example
 * dispatch({
 *   type: UNDO_REDUCER_PREFIX',
 *   payload: {
 *      type: 'UNDO | REDO | JUMP'
 *      propertyName: 'myProp'
 *      index?: <index_number>
 *   }
 * });
 */

export const UNDO_REDUCER_PREFIX = '&_NG-UNDO';

/**
 * An enumeration of possible action types for an undo/redo reducer.
 * UNDO // Represents an "undo" action
 * REDO // Represents a "redo" action
 * JUMP // Represents a "jump" action
 * CLEAR_HISTORY // Represents a "clear history" action
 */

export enum UndoActions {
    UNDO = 'undo',
    REDO = 'redo',
    JUMP = 'jump',
    CLEAR_HISTORY = 'clean_history'
}

/**
 * Represents an undo state that contains an array of past states and an array of future states.
 *
 * @interface
 * @name UndoState
 *
 * @property {any[]} past - An array of past states.
 * @property {any[]} future - An array of future states.
 *
 * @example
 * const state: UndoState = {
 *   past: [previousState],
 *   future: []
 * };
 */

export interface UndoState {
    past: any[],
    future: any[]
}

/**
 * Represents a state object for tracking undo history for multiple properties.
 *
 * @interface
 * @name NgUndoState
 *
 * @property {Object.<string, UndoState>} [key] - An object that maps property keys to their respective undo states.
 *
 * @example
 * const state: NgUndoState = {
 *   propertyName1: {
 *     past: [previousState1],
 *     future: []
 *   },
 *   propertyName2: {
 *     past: [previousState2],
 *     future: []
 *   },
 * };
 */

export interface NgUndoState {
    [key: string]: UndoState
}

/**
 * Represents an action to be dispatched to the NgUndo reducer.
 *
 * @interface NgUndoAction
 * @property {string} type - The type of the action.
 * @property {Object} payload - The data associated with the action.
 * @property {string} payload.type - The type of the undo action ('UNDO', 'REDO', 'JUMP', or 'CLEAR_HISTORY').
 * @property {string} payload.propertyName - The name of the property being changed.
 * @property {number} [payload.index] - The index of the state to jump to (used only for 'JUMP' action).
 * */

export interface NgUndoAction {
    type: string,
    payload: {
        type: string,
        propertyName: string,
        index?: number
    }
}

/**
 * Defines a map of state watch to change.
 */

export interface StateWatchMap {
    [key: string]: {
        path: string;
        filter?: () => boolean;
        limit?: number;
    }
}

/**
 * Represents the settings for tracking a specific property in the state for undo/redo operations.
 *
 * @param path - The path to the property in the state object. It is represented as an array of strings and numbers.
 * @param limit - (Optional) The maximum number of actions to keep in the undo/redo history.
 * If not specified, all actions will be kept.
 * @param filter - (Optional) A filter function that determines whether an action should be included in the undo/redo history.
 */

export interface Settings {
    path: Array<string | number>;
    filter?: () => boolean;
    limit?: number;
}
