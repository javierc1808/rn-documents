
export async function fetchWithTimeout(url: string, ms = 8000, opts?: RequestInit) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort("AbortError"), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, ...opts });
    return res;
  } finally {
    clearTimeout(id);
  }
}
