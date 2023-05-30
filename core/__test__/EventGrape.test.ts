import EventGrape, {
  EventGrapeEvents,
  EventGrapeCallback,
} from "../EventGrape";

describe("EventGrape", () => {
  const events: EventGrapeEvents = {
    namespaceA: ["eventA", "eventB"],
    namespaceB: ["eventA"],
  };
  let eventGrape: EventGrape;

  beforeEach(() => {
    eventGrape = new EventGrape(events);
  });

  describe("Exceptions", () => {
    test("Should throw exception if pass empty event when instantiate.", () => {
      expect(() => new EventGrape({})).toThrow(TypeError);
    });

    test("Should throw exception if dispatch an incorrect event.", () => {
      expect(() =>
        eventGrape.dispatch("namespaceB", "incorrect-event")
      ).toThrow(TypeError);
    });
  });

  describe("Method listen", () => {
    let callback: EventGrapeCallback;
    let remove: () => void;

    beforeEach(() => {
      callback = jest.fn();
      remove = eventGrape.listen("namespaceA", "eventA", callback);
    });

    test("Should continuosly listen to event.", () => {
      eventGrape.dispatch("namespaceA", "eventA");
      expect(callback).toHaveBeenCalledTimes(1);

      eventGrape.dispatch("namespaceA", "eventA");
      expect(callback).toHaveBeenCalledTimes(2);
    });

    test("Should be called with correct payload.", () => {
      const payload = "foo";

      eventGrape.dispatch("namespaceA", "eventA", payload);
      expect(callback).toHaveBeenCalledWith(payload);
    });

    test("Should not be called after being unregistered.", () => {
      remove();
      eventGrape.dispatch("namespaceA", "eventA");
      expect(callback).not.toHaveBeenCalled();
    });

    test("Should not be called if event hasn't been dispatched.", () => {
      eventGrape.dispatch("namespaceA", "eventB");
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("Method once", () => {
    let callback: EventGrapeCallback;
    let remove: () => void;

    beforeEach(() => {
      callback = jest.fn();
      remove = eventGrape.once("namespaceA", "eventA", callback);
    });

    test("Should only listen to event for one time.", () => {
      eventGrape.dispatch("namespaceA", "eventA");
      expect(callback).toHaveBeenCalledTimes(1);

      eventGrape.dispatch("namespaceA", "eventA");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test("Should be called with correct payload", () => {
      const payload = "foo";
      eventGrape.dispatch("namespaceA", "eventA", payload);
      expect(callback).toHaveBeenCalledWith(payload);
    });

    test("Should not be called after being unregistered", () => {
      remove();
      eventGrape.dispatch("namespaceA", "eventA");
      expect(callback).not.toHaveBeenCalled();
    });

    test("Should not be called if event hasn't been dispatched.", () => {
      eventGrape.dispatch("namespaceA", "eventB");
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("Method clear", () => {
    let callbackA: EventGrapeCallback;
    let callbackB: EventGrapeCallback;

    beforeEach(() => {
      callbackA = jest.fn();
      callbackB = jest.fn();
      eventGrape.listen("namespaceA", "eventA", callbackA);
      eventGrape.listen("namespaceA", "eventB", callbackB);
      eventGrape.clear("namespaceA", "eventA");
    });

    test("Should not be called after listeners have been cleared.", () => {
      eventGrape.dispatch("namespaceA", "eventA");
      expect(callbackA).not.toHaveBeenCalled();
    });

    test("Should not be affected when clearing listeners under other event.", () => {
      eventGrape.dispatch("namespaceA", "eventB");
      expect(callbackB).toHaveBeenCalledTimes(1);
    });
  });
});
