/**
 * angular-redux2/undo
 */

import { ngUndoMiddleware, UndoService } from './undo.service';
import { UNDO_REDUCER_PREFIX, UndoActions } from '../interfaces/undo.interface';
import { NgUndoStateActions } from '../components/undo-state.component';

jest.mock('@angular-redux2/store', () => ({
    get: jest.fn()
}));

describe('UndoService', () => {
    describe('constructor', () => {
        test('should create watchStateMap with correct values', () => {
            const stateWatchMap = {
                'testKey1': { path: 'path1.to.data' },
                'testKey2': { path: 'path2.to.data' },
            };

            const undoService = new UndoService(stateWatchMap);

            expect((undoService as any).watchStateMap).toHaveProperty('testKey1');
            expect((undoService as any).watchStateMap).toHaveProperty('testKey2');
        });
    });

    describe('watcherState', () => {
        test('should call watcherAction and detectChange methods', () => {
            const state = { /* mock state object */ };
            const action = { type: UNDO_REDUCER_PREFIX };
            const next = jest.fn();

            const undoService = new UndoService({});

            (undoService as any).watcherAction = jest.fn().mockReturnValue(state);
            (undoService as any).detectChange = jest.fn().mockReturnValue(state);

            const updatedState = undoService.watcherState(state, action, next);

            expect((undoService as any).watcherAction).toHaveBeenCalledWith(state, action);
            expect((undoService as any).detectChange).toHaveBeenCalledWith(state, next(state, action));
            expect(updatedState).toBe(state);
            expect(next).toHaveBeenCalledWith(state, action);
        });

        test('should not call watcherAction method if action type is not UNDO_REDUCER_PREFIX', () => {
            // Mock input data
            const state = { /* mock state object */ };
            const action = { type: 'SOME_OTHER_ACTION' };
            const next = jest.fn();

            const undoService = new UndoService({});

            (undoService as any).watcherAction = jest.fn().mockReturnValue(state);
            (undoService as any).detectChange = jest.fn().mockReturnValue(state);

            const updatedState = undoService.watcherState(state, action, next);

            expect((undoService as any).watcherAction).not.toHaveBeenCalled();
            expect((undoService as any).detectChange).toHaveBeenCalledWith(state, next(state, action));
            expect(updatedState).toBe(state);
            expect(next).toHaveBeenCalledWith(state, action);
        });
    });

    describe('watcherAction', () => {
        test('should return the state if type or propertyName is not provided', () => {
            const state = { /* mock state object */ };
            const action = { payload: { type: undefined, propertyName: undefined } };
            const undoService = new UndoService({});
            const updatedState = (undoService as any).watcherAction(state, action);

            expect(updatedState).toBe(state);
        });

        test('should call the corresponding undo action based on the type', () => {
            const state = { /* mock state object */ };
            const action = { payload: { type: UndoActions.UNDO, propertyName: 'test' } };
            const undoAction = {
                undo: jest.fn().mockReturnValue(state),
                redo: jest.fn(),
                jump: jest.fn(),
                clean_history: jest.fn()
            };

            const undoService = new UndoService({});
            (undoService as any).watchStateMap['test'] = undoAction;

            const updatedState = (undoService as any).watcherAction(state, action);


            expect(undoAction.undo).toHaveBeenCalledWith(state);
            expect(updatedState).toBe(state);
            expect(undoAction.redo).not.toHaveBeenCalled();
            expect(undoAction.jump).not.toHaveBeenCalled();
            expect(undoAction.clean_history).not.toHaveBeenCalled();
        });

        test('should return the state if the propertyName does not exist in watchStateMap', () => {
            const state = { /* mock state object */ };
            const action = { payload: { type: UndoActions.UNDO, propertyName: 'nonexistent' } };
            const undoService = new UndoService({});
            const updatedState = (undoService as any).watcherAction(state, action);

            expect(updatedState).toBe(state);
        });
    });
});

describe('ngUndoMiddleware', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });


    test('should call the watcherState method of UndoService and return the updated state', () => {
        const watcherStateSpy = jest.spyOn(UndoService.prototype, 'watcherState');
        const next = jest.fn().mockReturnValue({});
        const middleware = ngUndoMiddleware({});
        middleware({}, {}, next);

        expect(watcherStateSpy).toHaveBeenCalledTimes(1);
        expect(watcherStateSpy).toHaveBeenCalledWith({}, {}, next);
    });
});
