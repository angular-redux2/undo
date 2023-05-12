/**
 * angular-redux2/undo
 */

import { UNDO_REDUCER_PREFIX, UndoActions } from '../interfaces/undo.interface';

/**
 * Returns a base action object for an NgUndo reducer action.
 *
 * @function
 * @name baseAction
 *
 * @param {string} action - The type of action to perform (e.g. "UNDO" or "REDO" or "JUMP).
 * @param {string} propertyName - The name of the property being acted upon.
 * @returns {Object} An action object with a type and payload property.
 *
 * @example
 * const undoAction = baseAction('UNDO', 'myProp');
 * // Returns { type: '&_NG-UNDO', payload: { type: 'UNDO', propertyName: 'myProp' } }
 */

function baseAction(action: string, propertyName: string): any {
    return {
        type: UNDO_REDUCER_PREFIX,
        payload: {
            type: action,
            propertyName: propertyName,
        }
    };
}

/**
 * Returns an undo action object for an NgUndo reducer action.
 *
 * @function
 * @name undo
 *
 * @param {string} propertyName - The propertyName used to identify actions related to the NgUndo reducer.
 * @returns {Object} An action object with a type and payload property for undoing a property state change.
 *
 * @example
 * ```typescript
 * @Dispatch
 * public undo() {
 *     return undo('test');
 *     // Returns { type: '&_NG-UNDO', payload: { type: 'UNDO', propertyName: 'test' } }
 * }
 * ```
 */

export function undo(propertyName: string): any {
    return baseAction(UndoActions.UNDO, propertyName);
}

/**
 * Returns a redo action object for an NgUndo reducer action.
 *
 * @function
 * @name redo
 *
 * @param {string} propertyName - The propertyName used to identify actions related to the NgUndo reducer.
 * @returns {Object} An action object with a type and payload property for redoing a property state change.
 *
 * @example
 * @example
 * ```typescript
 * @Dispatch
 * public redo() {
 *     return redo('test');
 *     // Returns { type: '&_NG-UNDO', payload: { type: 'REDO', propertyName: 'test' } }
 * }
 * ```
 */

export function redo(propertyName: string): any {
    return baseAction(UndoActions.REDO, propertyName);
}

/**
 * Returns a clear history action object for an NgUndo reducer action.
 *
 * @function
 * @name clearHistory
 *
 * @param {string} propertyName - The propertyName used to identify actions related to the NgUndo reducer.
 * @returns {Object} An action object with a type and payload property for clearing the property state change history.
 *
 * @example
 * ```typescript
 * @Dispatch
 * public clearHistory() {
 *     return clearHistory('test');
 *     // Returns { type: '&_NG-UNDO', payload: { type: 'CLEAR_HISTORY', propertyName: 'test' } }
 * }
 * ```
 */

export function clearHistory(propertyName: string): any {
    return baseAction(UndoActions.CLEAR_HISTORY, propertyName);
}

/**
 * Returns a jump action object for an NgUndo reducer action with the specified index to jump to in the history.
 *
 * @function
 * @name jump
 *
 * @param {string} propertyName - The propertyName used to identify actions related to the NgUndo reducer.
 * @param {number} index - The index of the history to jump to.
 * @returns {Object} An action object with a type and payload property for jumping to a specific property state change in the history.
 *
 * @example
 * ```typescript
 * @Dispatch
 * public jump() {
 *     // Jump 2 steps forward in the history
 *     return jump('test', 2);
 *     // Returns { type: '&_NG-UNDO', payload: { type: 'JUMP', propertyName: 'test', index: 2 } }
 * }
 *
 * @Dispatch
 * public jump() {
 *     // Jump -2 steps back in the history
 *     return jump('test', -2);
 *     // Returns { type: '&_NG-UNDO', payload: { type: 'JUMP', propertyName: 'test', index: -2 } }
 * }
 * ```
 */

export function jump(propertyName: string, index: number): any {
    const action = baseAction(UndoActions.JUMP, propertyName);
    action['payload']['index'] = index;

    return action;
}
