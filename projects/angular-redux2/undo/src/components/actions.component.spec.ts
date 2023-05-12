/**
 * angular-redux2/undo
 */

import { UndoActions } from '../interfaces/undo.interface';
import { clearHistory, jump, redo, undo } from './actions.component';

describe('NgUndo reducer actions', () => {
    const propertyName = 'myProp';

    test('should return an undo action object', () => {
        const action = undo(propertyName);
        expect(action).toEqual({
            type: '&_NG-UNDO',
            payload: {
                type: UndoActions.UNDO,
                propertyName,
            },
        });
    });

    test('should return a redo action object', () => {
        const action = redo(propertyName);
        expect(action).toEqual({
            type: '&_NG-UNDO',
            payload: {
                type: UndoActions.REDO,
                propertyName,
            },
        });
    });

    test('should return a clear history action object', () => {
        const action = clearHistory(propertyName);
        expect(action).toEqual({
            type: '&_NG-UNDO',
            payload: {
                type: UndoActions.CLEAR_HISTORY,
                propertyName,
            },
        });
    });

    test('should return a jump action object to jump 5 steps forward in history', () => {
        const action = jump(propertyName, 5);
        expect(action).toEqual({
            type: '&_NG-UNDO',
            payload: {
                type: UndoActions.JUMP,
                propertyName,
                index: 5,
            },
        });
    });

    test('should return a jump action object to jump 5 steps backward in history', () => {
        const action = jump(propertyName, -5);
        expect(action).toEqual({
            type: '&_NG-UNDO',
            payload: {
                type: UndoActions.JUMP,
                propertyName,
                index: -5,
            },
        });
    });
});
