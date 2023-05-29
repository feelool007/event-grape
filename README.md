# EventPool

> A library that allow developers to manage their own events.

## Installation

```shell
$ npm install event-pool
```

## Usage

```js
import EventPool from "event-pool";

// Define your own events for each namespace before creating a new event pool.
// You can not add or remove events from an existing instance.
const events = {
  namespaceA: ["eventA", "eventB"],
  namespaceB: ["eventA"],
};

// Create a new event pool.
const eventPool = new EventPool(events);

const remove = eventPool.listen("namespaceA", "eventA", () => {
  console.log("Event namespaceA/eventA has been emitted.");
  // ...
});

// Dispatch event whenever you want.
eventPool.dispatch("namespaceA", "eventA");
// Output: Event namespaceA/eventA has been emitted.

// Remove the event listener once you don't need it anymore.
remove();
```

## Instance Methods

### listen(namespace: string, event: string, callback: (payload?: any) => void)

Register a new listener that continuously listen to the event under that namespace. Return a function used to unregister this listener.

```js
let remove = eventPool.listen("namespaceA", "eventA", () => {
  // Do something amazing.
});

remove();
```

### once(namespace: string, event: string, callback: (payload?: any) => void)

Basically same as "listen" with only one difference, it will be unregistered immediately after being invoked. Return a function used to unregister this listener.

```js
let remove = evenPool.once("namespaceA", "eventA", () => {
  // This listener will be invoked only one time.
});

// You still can unregister it before invoked.
remove();
```

### dispatch(namespace: string, event: string, payload?: any)

Dispatch the event under that namespace and invoke all listeners. The payload will pass to listeners if it has been assigned.

```js
eventPool.dispatch("namespaceA", "eventA");
```

### clear(namespace: string, event: string)

Unregister all listeners of the event under that namespace.

```js
eventPool.clear();
```

## License
[MIT](https://github.com/feelool007/event-pool/blob/master/README.md)
