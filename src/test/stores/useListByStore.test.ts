import { act, renderHook } from "@testing-library/react-native";
import { ListByEnum } from "../../models/enums";
import { useListByStore } from "../../stores/useListByStore";

describe("useListByStore", () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useListByStore.getState().setActiveElement(ListByEnum.LIST);
    });
  });

  it("should initialize with LIST as default value", () => {
    const { result } = renderHook(() => useListByStore());

    expect(result.current.activeElement).toBe(ListByEnum.LIST);
    expect(result.current.isGrid()).toBe(false);
  });

  it("should change to grid mode", () => {
    const { result } = renderHook(() => useListByStore());

    act(() => {
      result.current.setActiveElement(ListByEnum.GRID);
    });

    expect(result.current.activeElement).toBe(ListByEnum.GRID);
    expect(result.current.isGrid()).toBe(true);
  });

  it("should change back to list mode", () => {
    const { result } = renderHook(() => useListByStore());

    act(() => {
      result.current.setActiveElement(ListByEnum.GRID);
    });

    act(() => {
      result.current.setActiveElement(ListByEnum.LIST);
    });

    expect(result.current.activeElement).toBe(ListByEnum.LIST);
    expect(result.current.isGrid()).toBe(false);
  });

  it("should handle animation state", () => {
    const { result } = renderHook(() => useListByStore());

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

  it("should maintain state between renders", () => {
    const { result, rerender } = renderHook(() => useListByStore());

    act(() => {
      result.current.setActiveElement(ListByEnum.GRID);
    });

    expect(result.current.activeElement).toBe(ListByEnum.GRID);

    rerender({});

    expect(result.current.activeElement).toBe(ListByEnum.GRID);
  });
});
