import { act, renderHook } from "@testing-library/react-native";
import { SortByEnum } from "../../models/enums";
import { useSortByStore } from "../../stores/useSortByStore";

describe("useSortByStore", () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useSortByStore.getState().setActiveElement(SortByEnum.RECENT);
    });
  });

  it("should initialize with RECENT as default value", () => {
    const { result } = renderHook(() => useSortByStore());

    expect(result.current.activeElement).toBe(SortByEnum.RECENT);
  });

  it("should change sorting criteria", () => {
    const { result } = renderHook(() => useSortByStore());

    act(() => {
      result.current.setActiveElement(SortByEnum.AZ);
    });

    expect(result.current.activeElement).toBe(SortByEnum.AZ);
  });

  it("should change to ZA sorting", () => {
    const { result } = renderHook(() => useSortByStore());

    act(() => {
      result.current.setActiveElement(SortByEnum.ZA);
    });

    expect(result.current.activeElement).toBe(SortByEnum.ZA);
  });

  it("should handle animation state", () => {
    const { result } = renderHook(() => useSortByStore());

    expect(result.current.isAnimating).toBe(false);

    act(() => {
      result.current.setIsAnimating(true);
    });

    expect(result.current.isAnimating).toBe(true);

    act(() => {
      result.current.setIsAnimating(false);
    });

    expect(result.current.isAnimating).toBe(false);
  });

  it("should cycle through criteria with handlePress", () => {
    const { result } = renderHook(() => useSortByStore());

    // RECENT -> OLDEST
    act(() => {
      result.current.handlePress();
    });
    expect(result.current.activeElement).toBe(SortByEnum.OLDEST);
    expect(result.current.isAnimating).toBe(true);

    // OLDEST -> AZ
    act(() => {
      result.current.handlePress();
    });
    expect(result.current.activeElement).toBe(SortByEnum.AZ);
    expect(result.current.isAnimating).toBe(true);

    // AZ -> ZA
    act(() => {
      result.current.handlePress();
    });
    expect(result.current.activeElement).toBe(SortByEnum.ZA);
    expect(result.current.isAnimating).toBe(true);

    // ZA -> RECENT
    act(() => {
      result.current.handlePress();
    });
    expect(result.current.activeElement).toBe(SortByEnum.RECENT);
    expect(result.current.isAnimating).toBe(true);
  });

  it("should maintain state between renders", () => {
    const { result, rerender } = renderHook(() => useSortByStore());

    act(() => {
      result.current.setActiveElement(SortByEnum.AZ);
    });

    expect(result.current.activeElement).toBe(SortByEnum.AZ);

    rerender({});

    expect(result.current.activeElement).toBe(SortByEnum.AZ);
  });
});
