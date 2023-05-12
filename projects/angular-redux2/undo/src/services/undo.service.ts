/**
 * Import third-party
 */

import { get } from '@angular-redux2/store';

/**
 * Import third-party types
 */

import type { NextMiddleware } from '@angular-redux2/store';

/**
 * angular-redux2/undo
 */

import { NgUndoStateActions } from '../components/undo-state.component';
import { UNDO_REDUCER_PREFIX, UndoActions } from '../interfaces/undo.interface';

/**
 * angular-redux2/undo types
 */

import type { NgUndoAction, StateWatchMap } from '../interfaces/undo.interface';

export class UndoService {

    /**
     * Represents a mapping of state watch settings.
     *
     * @protected
     * @property {Object.<string, { path: Array<number|string> }>} watchStateMap - The map of state watch settings.
     */

    protected watchStateMap: {
        [key: string]: NgUndoStateActions
    } = {};

    /**
     * Constructs a new instance of the UndoService class.
     *
     * @constructor
     * @param {StateWatchMap} stateWatchMap - The state watch map containing the initial settings.
     */

    constructor(stateWatchMap: StateWatchMap) {
        for (const key in stateWatchMap) {
            this.watchStateMap[key] = new NgUndoStateActions(key, stateWatchMap[key].path.split('.'));
        }
    }

    /**
     * Middleware function for watching state changes and triggering undo actions.
     *
     * @param {any} state - The current state object.
     * @param {any} action - The dispatched action object.
     * @param {NextMiddleware} next - The next middleware function.
     * @returns {any} - The updated state after applying undo actions.
     */

    watcherState(state: any, action: any, next: NextMiddleware): any {
        if (action.type === UNDO_REDUCER_PREFIX) {
            state = this.watcherAction(state, action);
        }

        return this.detectChange(state, next(state, action));
    }

    /**
     * Watches the dispatched undo action and applies the corresponding undo operation on the state.
     *
     * @protected
     * @param {any} state - The current state object.
     * @param {NgUndoAction} action - The dispatched undo action object.
     * @returns {any} - The updated state after applying the undo action.
     */

    protected watcherAction(state: any, action: NgUndoAction): any {
        const { propertyName, type, index } = action.payload || {};

        if (!type || !this.watchStateMap[propertyName]) {
            return state;
        }

        const undoAction = this.watchStateMap[propertyName];

        switch (type) {
            case UndoActions.UNDO:
                return undoAction.undo(state);

            case UndoActions.REDO:
                return undoAction.redo(state);

            case UndoActions.JUMP:
                return undoAction.jump(state, index || 0);

            case UndoActions.CLEAR_HISTORY:
                return undoAction.clean_history(state);
        }

        return state;
    }

    /**
     * Detects changes in the state and inserts snapshots into the undo history when necessary.
     *
     * @protected
     * @param {any} state - The current state object.
     * @param {any} newState - The updated state object.
     * @returns {any} - The updated state with inserted snapshots.
     */

    protected detectChange(state: any, newState: any): any {
        for (const propertyName in this.watchStateMap) {
            const undoAction = this.watchStateMap[propertyName];

            const sliceState = get(state, undoAction.path);
            const sliceNewState = get(newState, undoAction.path);

            if (sliceNewState !== sliceState) {
                newState = undoAction.insert(newState, sliceState);
            }
        }

        return newState;
    }
}

/**
 * Creates a middleware function for managing undo functionality based on the provided state watch map.
 *
 * @param {StateWatchMap} stateWatchMap - The state watch map containing the initial settings.
 * @returns {Function} - The middleware function to be used with Redux.
 *
 * @example
 * ```typescript
 * const middleware: Array<Middleware> = [
 *     ngUndoMiddleware({
 *         'test': {
 *             path: 'path.to.data'
 *         }
 *     }),
 * ];
 * ngRedux.configureStore(rootReducer, {}, middleware, enhancer);
 * ```
 *
 * ```typescript
 * @Dispatch
 * public undo() {
 *     return undo('test');
 * }
 *
 * @Dispatch
 * public redo() {
 *     return redo('test');
 * }
 *
 * @Dispatch
 * public jump() {
 *     return jump('test', -2);
 * }
 *
 * @Dispatch
 * public jump() {
 *     return jump('test', 2);
 * }
 * ```
 */

export function ngUndoMiddleware(stateWatchMap: StateWatchMap): any {
    const undoService = new UndoService(stateWatchMap);

    /**
     * Middleware function for managing undo functionality.
     *
     * @param {any} state - The current state object.
     * @param {any} action - The dispatched action object.
     * @param {Function} next - The next middleware function.
     * @returns {any} - The updated state after applying undo actions.
     */
    return (state: any, action: any, next: any): any => {
        return undoService.watcherState(state, action, next);
    };
}
