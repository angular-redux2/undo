/**
 * angular-redux2/undo types
 */

import type { NgUndoState } from '../interfaces/undo.interface';

/**
 * Creates an undo reducer that can recognize the 'ngUndoState' key.
 *
 * @function
 * @name ngUndoState
 *
 * @param {NgUndoState} [state={}] - The current undo state.
 * @returns {NgUndoState} The current undo state.
 *
 * @example
 * const undoReducer = combineReducers({
 *   ngUndoState: ngUndoState,
 * });
 */

export function ngUndoState(state: NgUndoState = {}): NgUndoState {
    return state;
}
