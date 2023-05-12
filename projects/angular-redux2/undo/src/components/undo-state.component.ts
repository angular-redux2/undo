/**
 * Import third-party
 */

import { get, set } from '@angular-redux2/store';

/**
 * angular-redux2/undo
 */

import { HISTORY_STATE_KEY } from '../interfaces/undo.interface';

/**
 * Represents the actions for managing undo state.
 */

export class NgUndoStateActions {
    /**
     * The path to the key in the state object.
     * @type {Array<string | number>}
     */

    path: Array<string | number>;

    /**
     * The key associated with the history.
     * @protected
     * @type {string}
     */

    protected key: string;

    /**
     * Creates a new instance of the HistoryManager class.
     *
     * @param {string} key - The key associated with the history.
     * @param {Array<string | number>} path - The path to the key in the state object.
     * @constructor
     */

    constructor(key: string, path: Array<string | number>) {
        this.key = key;
        this.path = path;
    }

    /**
     * Inserts a snapshot into the history.
     * It adds the given snapshot to the past states of the history.
     * If the snapshot is undefined, it returns the current state unchanged.
     *
     * @param {any} currentState - The current state object.
     * @param {any} snapshot - The snapshot to insert into the history.
     * @returns {any} - The state object with the snapshot inserted into the history.
     */

    insert(currentState: any, snapshot: any): any {
        if (snapshot === undefined) {
            return currentState;
        }

        const { state, undoState } = this.getStates(currentState);

        undoState.future = [];
        return set(state, [ HISTORY_STATE_KEY, this.key, 'past' ], [
            ...undoState.past,
            snapshot
        ]);
    }

    /**
     * Undoes the previous state in the history.
     * It moves the previous state from the past to the future and applies it to the current state.
     * If there is no previous state to undo, it returns the current state unchanged.
     *
     * @param {any} currentState - The current state object.
     * @returns {any} - The state object after undoing the previous state in the history.
     */

    undo(currentState: any): any {
        const { state, undoState } = this.getStates(currentState);

        if (undoState.past.length === 0) {
            return currentState;
        }

        const pastSnapshot = undoState.past.pop();
        undoState.future.unshift(get(state, this.path));

        return set(state, this.path, pastSnapshot);
    }

    /**
     * Redoes the next state in the history.
     * It moves the next state from the future to the past and applies it to the current state.
     * If there is no future state to redo, it returns the current state unchanged.
     *
     * @param {any} currentState - The current state object.
     * @returns {any} - The state object after redoing the next state in the history.
     */

    redo(currentState: any): any {
        const { state, undoState } = this.getStates(currentState);

        if (undoState.future.length === 0) {
            return currentState;
        }

        const futureSnapshot = undoState.future.shift();
        undoState.past.push(get(state, this.path));

        return set(state, this.path, futureSnapshot);
    }

    /**
     * Jumps to a specific state in the history based on the given index.
     * If the index is positive, it jumps to a future state.
     * If the index is negative, it jumps to a past state.
     * If the index is zero, it returns the current state.
     *
     * @param {any} currentState - The current state object.
     * @param {number} index - The index representing the state to jump to.
     * @returns {any} - The state object after jumping to the specified state.
     */

    jump(currentState: any, index: number) {
        if (index > 0) {
            return this.jumpToFuture(currentState, index);
        }

        if (index < 0) {
            return this.jumpToPast(currentState, index * -1);
        }

        return currentState;
    }

    /**
     * Cleans the history by removing all past and future states.
     *
     * @param {any} currentState - The current state object.
     * @returns {any} - The updated state object with an empty history.
     */

    clean_history(currentState: any): any {
        return set(currentState, [ HISTORY_STATE_KEY, this.key ], {
            past: [],
            future: []
        });
    }

    /**
     * Jumps to a future state at the specified index in the redo history.
     *
     * @param {any} currentState - The current state object.
     * @param {number} index - The index of the future state to jump to.
     * @returns {any} - The updated state object after the jump.
     */

    protected jumpToFuture(currentState: any, index: number): any {
        const { state, undoState } = this.getStates(currentState);

        if (index < 0 || index >= undoState.future.length) {
            return currentState;
        }

        const snapshot = get(state, this.path);
        const activeSnapshot = undoState.future[index];
        const future = undoState.future.slice(index + 1);
        const past = undoState.past.concat([ snapshot ], undoState.future.slice(0, index));

        undoState.past = past;
        undoState.future = future;

        return set(state, this.path, activeSnapshot);
    }

    /**
     * Jumps to a past state at the specified index in the undo history.
     *
     * @param {any} currentState - The current state object.
     * @param {number} index - The index of the past state to jump to.
     * @returns {any} - The updated state object after the jump.
     */

    protected jumpToPast(currentState: any, index: number): any {
        const { state, undoState } = this.getStates(currentState);

        if (index < 0 || index >= undoState.past.length) {
            return currentState;
        }

        const snapshot = get(state, this.path);
        const activeSnapshot = undoState.past[index];
        const past = undoState.past.slice(0, index);
        const future = undoState.past
            .slice(index + 1)
            .concat([ snapshot ], undoState.future);

        undoState.past = past;
        undoState.future = future;

        return set(state, this.path, activeSnapshot);
    }

    /**
     * Retrieves the current state and undo state from the provided currentState.
     *
     * @param {any} currentState - The current state object.
     * @returns {{ state: any, undoState: any }} - An object containing the current state and undo state.
     */

    protected getStates(currentState: any): { state: any, undoState: any } {
        const state = { ...currentState } || {};
        state[HISTORY_STATE_KEY] = state[HISTORY_STATE_KEY] || {};

        const undoState = state[HISTORY_STATE_KEY][this.key] || { past: [], future: [] };
        state[HISTORY_STATE_KEY][this.key] = undoState;

        return { state, undoState };
    }
}
