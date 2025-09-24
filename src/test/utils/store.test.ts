import { createStore } from "../../utils/store";

describe("createStore", () => {
  it("should initialize with the correct value", () => {
    const initialValue = "test";
    const store = createStore(initialValue);

    expect(store.get()).toBe(initialValue);
  });

  it("should update the value with set", () => {
    const store = createStore("initial");
    const newValue = "updated";

    store.set(newValue);

    expect(store.get()).toBe(newValue);
  });

  it("should update the value with function in set", () => {
    const store = createStore(5);
    const increment = (prev: number) => prev + 1;

    store.set(increment);

    expect(store.get()).toBe(6);
  });

  it("should notify listeners when the value changes", () => {
    const store = createStore("initial");
    const listener = jest.fn();

    store.subscribe(listener);

    // Listener should be called immediately when subscribing
    expect(listener).toHaveBeenCalledWith("initial");

    // Clear previous calls
    listener.mockClear();

    store.set("updated");

    expect(listener).toHaveBeenCalledWith("updated");
  });

  it("should notify multiple listeners", () => {
    const store = createStore("initial");
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    store.subscribe(listener1);
    store.subscribe(listener2);

    // Clear subscription calls
    listener1.mockClear();
    listener2.mockClear();

    store.set("updated");

    expect(listener1).toHaveBeenCalledWith("updated");
    expect(listener2).toHaveBeenCalledWith("updated");
  });

  it("should allow unsubscribing listeners", () => {
    const store = createStore("initial");
    const listener = jest.fn();

    const unsubscribe = store.subscribe(listener);

    // Clear subscription calls
    listener.mockClear();

    store.set("first");
    expect(listener).toHaveBeenCalledWith("first");

    // Unsubscribe
    unsubscribe();

    listener.mockClear();

    store.set("second");
    expect(listener).not.toHaveBeenCalled();
  });

  it("should not notify if the value does not change (Object.is)", () => {
    const store = createStore("test");
    const listener = jest.fn();

    store.subscribe(listener);

    // Clear subscription calls
    listener.mockClear();

    // Set the same value
    store.set("test");

    expect(listener).not.toHaveBeenCalled();
  });

  it("should handle primitive values correctly", () => {
    const numberStore = createStore(0);
    const booleanStore = createStore(false);
    const nullStore = createStore(null);

    expect(numberStore.get()).toBe(0);
    expect(booleanStore.get()).toBe(false);
    expect(nullStore.get()).toBe(null);

    numberStore.set(42);
    booleanStore.set(true);
    nullStore.set("not null" as any);

    expect(numberStore.get()).toBe(42);
    expect(booleanStore.get()).toBe(true);
    expect(nullStore.get()).toBe("not null");
  });

  it("should handle objects correctly", () => {
    const initialObject = { name: "test", value: 1 };
    const store = createStore(initialObject);

    expect(store.get()).toEqual(initialObject);

    const newObject = { name: "updated", value: 2 };
    store.set(newObject);

    expect(store.get()).toEqual(newObject);
    expect(store.get()).not.toBe(initialObject); // Different references
  });

  it("should handle arrays correctly", () => {
    const initialArray = [1, 2, 3];
    const store = createStore(initialArray);

    expect(store.get()).toEqual(initialArray);

    const newArray = [4, 5, 6];
    store.set(newArray);

    expect(store.get()).toEqual(newArray);
    expect(store.get()).not.toBe(initialArray); // Different references
  });

  it("should handle complex update functions", () => {
    const store = createStore({ count: 0, name: "test" });

    store.set((prev) => ({ ...prev, count: prev.count + 1 }));

    expect(store.get()).toEqual({ count: 1, name: "test" });

    store.set((prev) => ({ ...prev, name: "updated" }));

    expect(store.get()).toEqual({ count: 1, name: "updated" });
  });
});
