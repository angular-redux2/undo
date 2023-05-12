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
- Take me to the [API docs](https://angular-redux2.github.io/undo).

To use `@angular-redux2/undo` in your Angular application, follow these steps:
Define a StateWatchMap object that maps the properties you want to track for undo/redo operations to their corresponding
state paths and configure the undo middleware in your Angular-Redux2/store setup by including it in the list of middleware:

```typescript
const middleware: Array<Middleware> = [
    ngUndoMiddleware({
        propertyName1: {
            path: 'path.to.property1'
        },
        propertyName2: {
            path: 'path.to.property2'
        },
    }),
];

ngRedux.configureStore(rootReducer, {}, middleware, enhancer);
```
Implement the undo/redo functionality in your Angular component or service.
You can use the `undo`, `redo`, `jump`, and `clear_history` methods provided by `NgUndoStateActions` to perform the corresponding actions:

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
    constructor(private undoStateActions: NgUndoStateActions) {}

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
