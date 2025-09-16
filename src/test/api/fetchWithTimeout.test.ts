import { fetchWithTimeout } from "../../api/fetchWithTimeout";

// Mock global fetch
global.fetch = jest.fn();

describe("fetchWithTimeout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should hacer una petición exitosa y retornar la respuesta", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: "test" }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetchWithTimeout("https://api.example.com/test");

    expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/test", {
      signal: expect.any(AbortSignal),
    });
    expect(result).toBe(mockResponse);
  });

  it("should usar el timeout por defecto de 8000ms", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: "test" }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await fetchWithTimeout("https://api.example.com/test");

    expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/test", {
      signal: expect.any(AbortSignal),
    });
  });

  it("should usar el timeout personalizado cuando se proporciona", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: "test" }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await fetchWithTimeout("https://api.example.com/test", 5000);

    expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/test", {
      signal: expect.any(AbortSignal),
    });
  });

  it("should pasar las opciones adicionales a fetch", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: "test" }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "data" }),
    };

    await fetchWithTimeout("https://api.example.com/test", 8000, options);

    expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/test", {
      signal: expect.any(AbortSignal),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "data" }),
    });
  });

  it("should abortar la petición cuando se alcanza el timeout", async () => {
    const mockAbortController = {
      abort: jest.fn(),
      signal: {} as AbortSignal,
    };

    // Mock AbortController
    const originalAbortController = global.AbortController;
    global.AbortController = jest
      .fn()
      .mockImplementation(() => mockAbortController);

    // Mock fetch para que nunca resuelva
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}), // Promise que nunca se resuelve
    );

    // Usar un timeout muy corto para la prueba
    const promise = fetchWithTimeout("https://api.example.com/test", 10);

    // Esperar a que se active el timeout
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(mockAbortController.abort).toHaveBeenCalledWith("AbortError");

    // Restaurar AbortController original
    global.AbortController = originalAbortController;
  });

  it("should limpiar el timeout cuando la petición se completa exitosamente", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: "test" }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    await fetchWithTimeout("https://api.example.com/test", 5000);

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("should limpiar el timeout cuando la petición falla", async () => {
    const mockError = new Error("Network error");
    (global.fetch as jest.Mock).mockRejectedValue(mockError);

    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    await expect(
      fetchWithTimeout("https://api.example.com/test", 5000),
    ).rejects.toThrow("Network error");

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("should manejar errors de red correctamente", async () => {
    const networkError = new Error("Network error");
    (global.fetch as jest.Mock).mockRejectedValue(networkError);

    await expect(
      fetchWithTimeout("https://api.example.com/test"),
    ).rejects.toThrow("Network error");
  });
});
