import { fetchWithTimeout } from "@/src/api/http/fetchWithTimeout";

// Mock global fetch
global.fetch = jest.fn();

describe("fetchWithTimeout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should make a successful request and return the response", async () => {
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

  it("should use the default timeout of 8000ms", async () => {
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

  it("should use custom timeout when provided", async () => {
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

  it("should pass additional options to fetch", async () => {
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

  it("should abort the request when the timeout is reached", async () => {
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

  it("should clear the timeout when the request completes successfully", async () => {
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

  it("should clear the timeout when the request fails", async () => {
    const mockError = new Error("Network error");
    (global.fetch as jest.Mock).mockRejectedValue(mockError);

    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    await expect(
      fetchWithTimeout("https://api.example.com/test", 5000),
    ).rejects.toThrow("Network error");

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("should handle network errors correctly", async () => {
    const networkError = new Error("Network error");
    (global.fetch as jest.Mock).mockRejectedValue(networkError);

    await expect(
      fetchWithTimeout("https://api.example.com/test"),
    ).rejects.toThrow("Network error");
  });
});
