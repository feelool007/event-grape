import reduce from "../utils/reduce";
import filter from "../utils/filter";

interface EventPoolEvents {
  [namespace: string]: string[];
}

interface EventPoolCallback<P = any> {
  (payload?: P): void;
}

interface EventPoolListener {
  id: number;
  callback: EventPoolCallback;
  once: boolean;
}

interface EventPoolListeners {
  [event: string]: EventPoolListener[];
}

class EventPool {
  private listeners: EventPoolListeners = {};
  private incrementalListenerId: number = 0;

  constructor(events: EventPoolEvents) {
    let namespaces = Object.keys(events);
    if (namespaces.length === 0) {
      throw new TypeError(
        "Should specify at least one event when initialize event pool."
      );
    }
    this.listeners = reduce<string, EventPoolListeners>(
      namespaces,
      (acc, namespace) => {
        events[namespace].forEach((event) => {
          acc[`${namespace}/${event}`] = [];
        });
        return acc;
      },
      {}
    );
  }

  private validate(namespace: string, event: string) {
    let events = Object.keys(this.listeners);
    if (!events.includes(`${namespace}/${event}`)) {
      throw new TypeError(`Not a valid event type: ${namespace}/${event}`);
    }
  }

  private add(namespace: string, event: string, listener: EventPoolListener) {
    this.listeners[`${namespace}/${event}`].push(listener);

    return () => {
      this.remove(namespace, event, listener.id);
    };
  }

  private remove(namespace: string, event: string, id: number) {
    this.listeners[`${namespace}/${event}`] = filter(
      this.listeners[`${namespace}/${event}`],
      (l) => l.id !== id
    );
  }

  listen(namespace: string, event: string, callback: EventPoolCallback) {
    this.validate(namespace, event);
    return this.add(namespace, event, {
      id: ++this.incrementalListenerId,
      callback,
      once: false,
    });
  }

  once(namespace: string, event: string, callback: EventPoolCallback) {
    this.validate(namespace, event);
    return this.add(namespace, event, {
      id: ++this.incrementalListenerId,
      callback,
      once: true,
    });
  }

  dispatch(namespace: string, event: string, payload?: any) {
    this.validate(namespace, event);
    this.listeners[`${namespace}/${event}`] = reduce(
      this.listeners[`${namespace}/${event}`],
      (acc, curr) => {
        curr.callback(payload);
        if (!curr.once) acc.push(curr);
        return acc;
      },
      []
    );
  }

  clear(namespace: string, event: string) {
    this.validate(namespace, event);
    this.listeners[`${namespace}/${event}`] = [];
  }
}

export default EventPool;
