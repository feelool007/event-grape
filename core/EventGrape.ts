import reduce from "../utils/reduce";
import filter from "../utils/filter";

interface EventGrapeEvents {
  [namespace: string]: string[];
}

interface EventGrapeCallback<P = any> {
  (payload?: P): void;
}

interface EventGrapeListener {
  id: number;
  callback: EventGrapeCallback;
  once: boolean;
}

interface EventGrapeListeners {
  [event: string]: EventGrapeListener[];
}

class EventGrape {
  private listeners: EventGrapeListeners = {};
  private incrementalListenerId: number = 0;

  constructor(events: EventGrapeEvents) {
    let namespaces = Object.keys(events);
    if (namespaces.length === 0) {
      throw new TypeError(
        "Should specify at least one event when initialize event grape."
      );
    }
    this.listeners = reduce<string, EventGrapeListeners>(
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

  private add(namespace: string, event: string, listener: EventGrapeListener) {
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

  listen(namespace: string, event: string, callback: EventGrapeCallback) {
    this.validate(namespace, event);
    return this.add(namespace, event, {
      id: ++this.incrementalListenerId,
      callback,
      once: false,
    });
  }

  once(namespace: string, event: string, callback: EventGrapeCallback) {
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

export default EventGrape;
