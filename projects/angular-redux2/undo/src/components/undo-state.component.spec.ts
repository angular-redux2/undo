/**
 * angular-redux2/undo
 */

import { NgUndoStateActions } from './undo-state.component';
import { HISTORY_STATE_KEY } from '../interfaces/undo.interface';

describe('NgUndoStateActions', () => {
    describe('insert', () => {
        test('should insert a snapshot into the past history', () => {
            const undoStateActions = new NgUndoStateActions('key', { path: [ 'path', 'to', 'watcher' ] });
            const currentState = {
                data: 'initial data'
            };

            const snapshot = 'new snapshot';
            const nextState = undoStateActions.insert(currentState, snapshot);

            expect(nextState).not.toBe(currentState);
            expect(nextState.data).toBe(currentState.data);
            expect(nextState[HISTORY_STATE_KEY].key.past).toEqual([ snapshot ]);
            expect(nextState[HISTORY_STATE_KEY].key.future).toEqual([]);
        });

        test('should return the current state if the snapshot is undefined', () => {
            const undoStateActions = new NgUndoStateActions('key', { path: [ 'path', 'to', 'watcher' ] });
            const currentState = {
                data: 'initial data'
            };

            const snapshot = undefined;
            const nextState = undoStateActions.insert(currentState, snapshot);

            expect(nextState).toBe(currentState); // Ensure the current state is returned
        });
    });

    describe('undo', () => {
        test('should undo the last snapshot in the past history', () => {
            const undoStateActions = new NgUndoStateActions('key', { path: [ 'path', 'to', 'watcher' ] });
            const currentState = {
                data: 'initial data',
                [HISTORY_STATE_KEY]: {
                    key: {
                        past: [ 'snapshot1', 'snapshot2' ],
                        future: [ 'snapshot4' ]
                    }
                },
                path: {
                    to: {
                        watcher: 'snapshot3'
                    }
                }
            };

            const nextState = undoStateActions.undo(currentState);

            expect(nextState).not.toBe(currentState);
            expect(nextState.data).toBe(currentState.data);
            expect(nextState.path.to.watcher).toBe('snapshot2');
            expect(nextState[HISTORY_STATE_KEY].key.past).toEqual([ 'snapshot1' ]);
            expect(nextState[HISTORY_STATE_KEY].key.future).toEqual([ 'snapshot3', 'snapshot4' ]);
        });

        test('should return the current state if there are no snapshots in the past history', () => {
            const undoStateActions = new NgUndoStateActions('key', { path: [ 'path', 'to', 'watcher' ] });
            const currentState = {
                data: 'initial data',
                [HISTORY_STATE_KEY]: {
                    key: {
                        past: [],
                        future: [ 'snapshot1', 'snapshot2' ]
                    }
                },
                path: {
                    to: {
                        watcher: 'snapshot3'
                    }
                }
            };

            const nextState = undoStateActions.undo(currentState);

            expect(nextState).toEqual(currentState);
        });
    });

    describe('redo', () => {
        test('should redo the last snapshot in the future history', () => {
            const undoStateActions = new NgUndoStateActions('key', { path: [ 'path', 'to', 'watcher' ] });
            const currentState = {
                data: 'initial data',
                [HISTORY_STATE_KEY]: {
                    key: {
                        past: [ 'snapshot1', 'snapshot2' ],
                        future: [ 'snapshot4' ]
                    }
                },
                path: {
                    to: {
                        watcher: 'snapshot3'
                    }
                }
            };

            const nextState = undoStateActions.redo(currentState);

            expect(nextState).not.toBe(currentState);
            expect(nextState.data).toBe(currentState.data);
            expect(nextState.path.to.watcher).toBe('snapshot4');
            expect(nextState[HISTORY_STATE_KEY].key.past).toEqual([ 'snapshot1', 'snapshot2', 'snapshot3' ]);
            expect(nextState[HISTORY_STATE_KEY].key.future).toEqual([]);
        });

        test('should return the current state if there are no snapshots in the future history', () => {
            const undoStateActions = new NgUndoStateActions('key', { path: [ 'path', 'to', 'watcher' ] });
            const currentState = {
                data: 'initial data',
                [HISTORY_STATE_KEY]: {
                    key: {
                        past: [ 'snapshot1', 'snapshot2' ],
                        future: []
                    }
                },
                path: {
                    to: {
                        watcher: 'snapshot3'
                    }
                }
            };

            const nextState = undoStateActions.redo(currentState);

            expect(nextState).toEqual(currentState);
        });
    });

    describe('jump', () => {
        test('should jump to the specified index in the future history', () => {
            const undoStateActions = new NgUndoStateActions('key', { path: [ 'path', 'to', 'watcher' ] });
            const currentState = {
                data: 'initial data',
                [HISTORY_STATE_KEY]: {
                    key: {
                        past: [ 'snapshot1', 'snapshot2' ],
                        future: [ 'snapshot4', 'snapshot5', 'snapshot6' ]
                    }
                },
                path: {
                    to: {
                        watcher: 'snapshot3'
                    }
                }
            };

            const jumpIndex = 2;
            const nextState = undoStateActions.jump(currentState, jumpIndex);

            expect(nextState).not.toBe(currentState);
            expect(nextState.data).toBe(currentState.data);
            expect(nextState.path.to.watcher).toBe('snapshot6');
            expect(nextState[HISTORY_STATE_KEY].key.past).toEqual([ 'snapshot1', 'snapshot2', 'snapshot3', 'snapshot4', 'snapshot5' ]);
            expect(nextState[HISTORY_STATE_KEY].key.future).toEqual([]);
        });

        test('should jump to the specified index in the past history', () => {
            const undoStateActions = new NgUndoStateActions('key', { path: [ 'path', 'to', 'watcher' ] });
            const currentState = {
                data: 'initial data',
                [HISTORY_STATE_KEY]: {
                    key: {
                        past: [ 'snapshot1', 'snapshot2', 'snapshot3' ],
                        future: [ 'snapshot5', 'snapshot6' ]
                    }
                },
                path: {
                    to: {
                        watcher: 'snapshot4'
                    }
                }
            };

            const jumpIndex = -2;
            const nextState = undoStateActions.jump(currentState, jumpIndex);

            expect(nextState).not.toBe(currentState);
            expect(nextState.data).toBe(currentState.data);
            expect(nextState.path.to.watcher).toBe('snapshot3');
            expect(nextState[HISTORY_STATE_KEY].key.past).toEqual([ 'snapshot1', 'snapshot2' ]);
            expect(nextState[HISTORY_STATE_KEY].key.future).toEqual([ 'snapshot4', 'snapshot5', 'snapshot6' ]);
        });

        test('should return the current state if the index is zero', () => {
            const undoStateActions = new NgUndoStateActions('key', { path: [ 'path', 'to', 'watcher' ] });
            const currentState = {
                data: 'initial data',
                [HISTORY_STATE_KEY]: {
                    key: {
                        past: [ 'snapshot1', 'snapshot2', 'snapshot3' ],
                        future: [ 'snapshot5', 'snapshot6' ]
                    }
                },
                path: {
                    to: {
                        watcher: 'snapshot4'
                    }
                }
            };

            const jumpIndex = 0;
            const nextState = undoStateActions.jump(currentState, jumpIndex);

            expect(nextState).toBe(currentState);
            expect(nextState.path.to.watcher).toBe('snapshot4');
        });

        test('should return the current state if the index is out of range', () => {
            const undoStateActions = new NgUndoStateActions('key', { path: [ 'path', 'to', 'watcher' ] });
            const currentState = {
                data: 'initial data',
                [HISTORY_STATE_KEY]: {
                    key: {
                        past: [ 'snapshot1', 'snapshot2', 'snapshot3' ],
                        future: [ 'snapshot5', 'snapshot6' ]
                    }
                },
                path: {
                    to: {
                        watcher: 'snapshot4'
                    }
                }
            };

            const jumpIndex = 5;
            const nextState = undoStateActions.jump(currentState, jumpIndex);
            expect(nextState).toEqual(currentState);
            expect(nextState.path.to.watcher).toBe('snapshot4');
        });
    });
});
