export type Listener<T> = (value: T) => void;

export function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<Listener<T>>();

  const get = () => value;

  const set = (next: T | ((prev: T) => T)) => {
    const newValue = typeof next === "function" ? (next as (p: T) => T)(value) : next;
    if (Object.is(newValue, value)) return; // evita notificar si no cambia
    value = newValue;
    // emitir sobre snapshot para evitar efectos por mutación en el loop
    const snapshot = [...listeners];
    for (const l of snapshot) l(value);
  };

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    // opcional: enviar valor actual al suscribir
    listener(value);
    return () => listeners.delete(listener);
  };

  return { get, set, subscribe };
}