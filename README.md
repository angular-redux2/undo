# angular-redux2/undo

`@angular-redux2/undo` is an @angular-redux2/store package that provides undo and redo functionality for state
management using Redux.

[![Discord](https://img.shields.io/discord/1050521693795405874?logo=Angular-redux2)](https://discord.com/invite/7BnsAqst6W)
[![npm version](https://img.shields.io/npm/v/@angular-redux2/undo.svg)](https://www.npmjs.com/package/@angular-redux2/undo)
[![downloads per month](https://img.shields.io/npm/dm/@angular-redux2/undo.svg)](https://www.npmjs.com/package/@angular-redux2/undo)

## Installation

You can install angular-redux2/sync using npm:

```bash
npm install @angular-redux2/undo
```

## Usage

> Take me to the [API docs](https://angular-redux2.github.io/undo).

To use `@angular-redux2/undo` in your Angular application, follow these steps:
Define a StateWatchMap object that maps the properties you want to track for undo/redo operations to their corresponding
state paths and configure the undo middleware in your Angular-Redux2/store setup by including it in the list of
middleware:

```typescript
const middleware: Array<Middleware> = [
    ngUndoMiddleware({
        propertyName1: {
            path: 'path.to.property1'
        },
        propertyName2: {
            path: 'path.to.property2',
            limit: 5
        },
    }),
];

ngRedux.configureStore(rootReducer, {}, middleware, enhancer);
```

settings:

- `path` (required): The path to the property in the state object using dot notation.
- `filter` (optional): A filter function that determines if the property should be watched for undo/redo. Return true to
  include the property, and false to exclude it. If not specified, all properties are included.
- `limit` (optional): The maximum number of past snapshots to keep in the undo history. If the limit is reached, the
  oldest snapshots are discarded. If not specified, no limit is applied.

Implement the undo/redo functionality in your Angular component or service.
You can use the `undo`, `redo`, `jump`, and `clear_history` methods provided by `NgUndoStateActions` to perform the
corresponding actions:

```typescript
// Example component
import { Component } from '@angular/core';
import { undo, redo, jump, clear_history } from '@angular-redux2/undo';

@Component({
    selector: 'app-example',
    template: `
    <button (click)="onUndo()">Undo</button>
    <button (click)="onRedo()">Redo</button>
    <button (click)="onJump(-2)">Jump Backward</button>
    <button (click)="onJump(2)">Jump Forward</button>
    <button (click)="onClearHistory()">Clear History</button>
  `
})
export class ExampleComponent {
    constructor(private undoStateActions: NgUndoStateActions) {
    }

    @Dispatch
    onUndo() {
        this.undoStateActions.undo('propertyName1');
    }

    @Dispatch
    onRedo() {
        this.undoStateActions.redo('propertyName1');
    }

    @Dispatch
    onJump(index: number) {
        this.undoStateActions.jump('propertyName1', index);
    }

    @Dispatch
    onClearHistory() {
        this.undoStateActions.clear_history('propertyName1');
    }
}
```

## State Watch Map

The state watch map is an object that defines the paths to the state properties you want to track for undo. It has the
following structure:

```typescript
export interface StateWatchMap {
    [key: string]: {
        path: string;
        filter?: (action: any, currentState: any, snapshot: any) => boolean;
        limit?: number;
    }
}
```

- `key` (string): The unique identifier for the state property.
- `path` (string): The dot-separated path to the state property.
- `filter` (optional function): A filter function that determines if an action should be captured in the undo history
  for the specific state property.

## Custom Filters

You can define custom filter functions to control which actions are captured in the undo history for each state
property.
The filter function takes three parameters:

- `action`: The dispatched action object.
- `currentState`: The current store state object.
- `snapshot`: The snapshot to insert into the history.

The filter function should return true if the action should be captured, or false otherwise.
Here's an example of a custom filter function that only captures actions with specific types:

```typescript
const stateWatchMap: StateWatchMap = {
    'todos': {
        path: 'todos',
        filter: (action: any, currentState: any, snapshot: any): boolean => {
            return action.type === 'ADD_TODO' || action.type === 'REMOVE_TODO';
        }
    }
};
```
