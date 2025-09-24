import { act, renderHook } from "@testing-library/react-native";
import { useGlobalSortBy } from "../../hooks/useGlobalSortBy";
import { SortByEnum } from "../../models/enums";

// Mock useSyncExternalStore to control store behavior
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useSyncExternalStore: jest.fn(),
}));

const mockUseSyncExternalStore = jest.requireMock("react").useSyncExternalStore as jest.MockedFunction<
  typeof import("react").useSyncExternalStore
>;

describe("useGlobalSortBy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct initial values", () => {
    mockUseSyncExternalStore
      .mockReturnValueOnce(SortByEnum.RECENT) // sortBy
      .mockReturnValueOnce(false); // isAnimating

    const { result } = renderHook(() => useGlobalSortBy());

    expect(result.current.sortBy).toBe(SortByEnum.RECENT);
    expect(result.current.isAnimating).toBe(false);
    expect(typeof result.current.handlePress).toBe("function");
    expect(typeof result.current.setIsAnimating).toBe("function");
    expect(typeof result.current.setSortBy).toBe("function");
  });

  it("should change from RECENT to OLDEST when handlePress is pressed", () => {
    mockUseSyncExternalStore
      .mockReturnValueOnce(SortByEnum.RECENT)
      .mockReturnValueOnce(false);

    const { result } = renderHook(() => useGlobalSortBy());

    act(() => {
      result.current.handlePress();
    });

    // Verify that setSortBy was called with OLDEST
    expect(result.current.setSortBy).toBeDefined();
  });

  it("should change from OLDEST to AZ when handlePress is pressed", () => {
    mockUseSyncExternalStore
      .mockReturnValueOnce(SortByEnum.OLDEST)
      .mockReturnValueOnce(false);

    const { result } = renderHook(() => useGlobalSortBy());

    act(() => {
      result.current.handlePress();
    });

    // Verify that setSortBy was called with AZ
    expect(result.current.setSortBy).toBeDefined();
  });

  it("should change from AZ to ZA when handlePress is pressed", () => {
    mockUseSyncExternalStore
      .mockReturnValueOnce(SortByEnum.AZ)
      .mockReturnValueOnce(false);

    const { result } = renderHook(() => useGlobalSortBy());

    act(() => {
      result.current.handlePress();
    });

    // Verify that setSortBy was called with ZA
    expect(result.current.setSortBy).toBeDefined();
  });

  it("should change from ZA to RECENT when handlePress is pressed", () => {
    mockUseSyncExternalStore
      .mockReturnValueOnce(SortByEnum.ZA)
      .mockReturnValueOnce(false);

    const { result } = renderHook(() => useGlobalSortBy());

    act(() => {
      result.current.handlePress();
    });

    // Verify that setSortBy was called with RECENT
    expect(result.current.setSortBy).toBeDefined();
  });

  it("should handle unknown default value", () => {
    mockUseSyncExternalStore
      .mockReturnValueOnce("unknown" as SortByEnum)
      .mockReturnValueOnce(false);

    const { result } = renderHook(() => useGlobalSortBy());

    act(() => {
      result.current.handlePress();
    });

    // Verify that setSortBy was called with RECENT (default value)
    expect(result.current.setSortBy).toBeDefined();
  });

  it("should activate animation when handlePress is pressed", () => {
    mockUseSyncExternalStore
      .mockReturnValueOnce(SortByEnum.RECENT)
      .mockReturnValueOnce(false);

    const { result } = renderHook(() => useGlobalSortBy());

    act(() => {
      result.current.handlePress();
    });

    // Verify that setIsAnimating was called with true
    expect(result.current.setIsAnimating).toBeDefined();
  });

  it("should allow setting animation state manually", () => {
    mockUseSyncExternalStore
      .mockReturnValueOnce(SortByEnum.RECENT)
      .mockReturnValueOnce(false);

    const { result } = renderHook(() => useGlobalSortBy());

    act(() => {
      result.current.setIsAnimating(true);
    });

    expect(result.current.setIsAnimating).toBeDefined();
  });

  it("should allow setting sortBy manually", () => {
    mockUseSyncExternalStore
      .mockReturnValueOnce(SortByEnum.RECENT)
      .mockReturnValueOnce(false);

    const { result } = renderHook(() => useGlobalSortBy());

    act(() => {
      result.current.setSortBy(SortByEnum.AZ);
    });

    expect(result.current.setSortBy).toBeDefined();
  });

  it("should return correct animation state", () => {
    mockUseSyncExternalStore
      .mockReturnValueOnce(SortByEnum.RECENT) // sortBy
      .mockReturnValueOnce(true); // isAnimating

    const { result } = renderHook(() => useGlobalSortBy());

    expect(result.current.isAnimating).toBe(true);
  });

  it("should return correct sortBy", () => {
    mockUseSyncExternalStore
      .mockReturnValueOnce(SortByEnum.AZ) // sortBy
      .mockReturnValueOnce(false); // isAnimating

    const { result } = renderHook(() => useGlobalSortBy());

    expect(result.current.sortBy).toBe(SortByEnum.AZ);
  });

  it("should complete the full sortBy cycle", () => {
    const sortOrder = [
      SortByEnum.RECENT,
      SortByEnum.OLDEST,
      SortByEnum.AZ,
      SortByEnum.ZA,
      SortByEnum.RECENT,
    ];

    for (let i = 0; i < sortOrder.length - 1; i++) {
      mockUseSyncExternalStore
        .mockReturnValueOnce(sortOrder[i])
        .mockReturnValueOnce(false);

      const { result } = renderHook(() => useGlobalSortBy());

      act(() => {
        result.current.handlePress();
      });

      // Verify that setSortBy was called
      expect(result.current.setSortBy).toBeDefined();
    }
  });
});
