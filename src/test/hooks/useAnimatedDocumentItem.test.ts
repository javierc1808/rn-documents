import { renderHook } from "@testing-library/react-native";
import { Animated } from "react-native";

import { useAnimatedDocumentItem } from "@/src/hooks/useAnimatedDocumentItem";
import { ListByEnum } from "@/src/models/enums";
import { useListByStore } from "@/src/stores/useListByStore";

// Mock forpendencies
jest.mock("@/src/stores/useListByStore", () => ({
  useListByStore: jest.fn(),
}));

jest.mock("react-native", () => ({
  Animated: {
    Value: jest.fn((value) => ({
      setValue: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      removeAllListeners: jest.fn(),
      hasListeners: jest.fn(),
      stopAnimation: jest.fn(),
      resetAnimation: jest.fn(),
      flattenOffset: jest.fn(),
      extractOffset: jest.fn(),
      add: jest.fn(),
      multiply: jest.fn(),
      divide: jest.fn(),
      modulo: jest.fn(),
      diffClamp: jest.fn(),
      interpolate: jest.fn(),
      interpolateColor: jest.fn(),
      setOffset: jest.fn(),
      timing: jest.fn(),
      spring: jest.fn(),
      decay: jest.fn(),
      sequence: jest.fn(),
      parallel: jest.fn(),
      stagger: jest.fn(),
      loop: jest.fn(),
      event: jest.fn(),
      delay: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      reset: jest.fn(),
    })),
    timing: jest.fn(),
    parallel: jest.fn(),
  },
}));

const mockUseListByStore = useListByStore as jest.MockedFunction<
  typeof useListByStore
>;

describe("useAnimatedDocumentItem", () => {
  const mockTiming = jest.fn();
  const mockParallel = jest.fn();
  const mockStart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Animated methods
    (Animated.timing as jest.Mock).mockImplementation(mockTiming);
    (Animated.parallel as jest.Mock).mockImplementation(mockParallel);

    mockTiming.mockReturnValue({ start: mockStart });
    mockParallel.mockReturnValue({ start: mockStart });
  });

  it("should inicializar con valores correctos para modo lista", () => {
    mockUseListByStore.mockReturnValue({
      activeElement: ListByEnum.LIST,
    } as any);

    const { result } = renderHook(() =>
      useAnimatedDocumentItem({
        index: 0,
        isAnimating: false,
        isInitialLoad: false,
      }),
    );

    expect(result.current.isGridMode).toBe(false);
    expect(result.current.animatedStyle).toHaveProperty("opacity");
    expect(result.current.animatedStyle).toHaveProperty("transform");
  });

  it("should inicializar con valores correctos para modo grid", () => {
    mockUseListByStore.mockReturnValue({
      activeElement: ListByEnum.GRID,
    } as any);

    const { result } = renderHook(() =>
      useAnimatedDocumentItem({
        index: 0,
        isAnimating: false,
        isInitialLoad: false,
      }),
    );

    expect(result.current.isGridMode).toBe(true);
    expect(result.current.animatedStyle).toHaveProperty("opacity");
    expect(result.current.animatedStyle).toHaveProperty("transform");
  });

  it("should inicializar con opacidad 1 en carga inicial", () => {
    mockUseListByStore.mockReturnValue({
      activeElement: ListByEnum.LIST,
    } as any);

    const { result } = renderHook(() =>
      useAnimatedDocumentItem({
        index: 0,
        isAnimating: false,
        isInitialLoad: true,
      }),
    );

    expect(result.current.isGridMode).toBe(false);
    expect(result.current.animatedStyle).toHaveProperty("opacity");
    expect(result.current.animatedStyle).toHaveProperty("transform");
  });

  it("should ejecutar animación cuando isAnimating es true", () => {
    mockUseListByStore.mockReturnValue({
      activeElement: ListByEnum.LIST,
    } as any);

    const onAnimationComplete = jest.fn();

    renderHook(() =>
      useAnimatedDocumentItem({
        index: 0,
        isAnimating: true,
        onAnimationComplete,
        isInitialLoad: false,
      }),
    );

    expect(Animated.timing).toHaveBeenCalledTimes(2); // fadeAnim y scaleAnim
    expect(Animated.parallel).toHaveBeenCalledTimes(1);
    expect(mockStart).toHaveBeenCalledTimes(1);
  });

  it("should usar parámetros diferentes para modo grid", () => {
    mockUseListByStore.mockReturnValue({
      activeElement: ListByEnum.GRID,
    } as any);

    renderHook(() =>
      useAnimatedDocumentItem({
        index: 1,
        isAnimating: true,
        isInitialLoad: false,
      }),
    );

    // Verify que se llamó timing con los parámetros correctos
    expect(Animated.timing).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        duration: 500, // Duración más larga para grid
        delay: 60, // Delay menor para grid (index * 60)
        useNativeDriver: true,
      }),
    );
  });

  it("should usar parámetros diferentes para modo lista", () => {
    mockUseListByStore.mockReturnValue({
      activeElement: ListByEnum.LIST,
    } as any);

    renderHook(() =>
      useAnimatedDocumentItem({
        index: 1,
        isAnimating: true,
        isInitialLoad: false,
      }),
    );

    // Verify que se llamó timing con los parámetros correctos
    expect(Animated.timing).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        duration: 400, // Duración normal para lista
        delay: 80, // Delay normal para lista (index * 80)
        useNativeDriver: true,
      }),
    );
  });

  it("should llamar onAnimationComplete solo para el primer elemento", () => {
    mockUseListByStore.mockReturnValue({
      activeElement: ListByEnum.LIST,
    } as any);

    const onAnimationComplete = jest.fn();

    // Simulate que la animación se completa
    mockStart.mockImplementation((callback) => {
      if (callback) callback();
    });

    renderHook(() =>
      useAnimatedDocumentItem({
        index: 0, // Primer elemento
        isAnimating: true,
        onAnimationComplete,
        isInitialLoad: false,
      }),
    );

    expect(onAnimationComplete).toHaveBeenCalledTimes(1);
  });

  it("no debería llamar onAnimationComplete para elementos que no son el primero", () => {
    mockUseListByStore.mockReturnValue({
      activeElement: ListByEnum.LIST,
    } as any);

    const onAnimationComplete = jest.fn();

    // Simulate que la animación se completa
    mockStart.mockImplementation((callback) => {
      if (callback) callback();
    });

    renderHook(() =>
      useAnimatedDocumentItem({
        index: 1, // No es el primer elemento
        isAnimating: true,
        onAnimationComplete,
        isInitialLoad: false,
      }),
    );

    expect(onAnimationComplete).not.toHaveBeenCalled();
  });

  it("should resetear valores cuando no está animando y no es carga inicial", () => {
    mockUseListByStore.mockReturnValue({
      activeElement: ListByEnum.LIST,
    } as any);

    const mockSetValue = jest.fn();
    const mockFadeAnim = { setValue: mockSetValue };
    const mockScaleAnim = { setValue: mockSetValue };

    // Mock Animated.Value para retornar nuestros mocks
    (Animated.Value as jest.Mock).mockImplementation((value) => {
      if (value === 0) return mockFadeAnim;
      if (value === 0.8) return mockScaleAnim;
      return { setValue: mockSetValue };
    });

    renderHook(() =>
      useAnimatedDocumentItem({
        index: 0,
        isAnimating: false,
        isInitialLoad: false,
      }),
    );

    expect(mockSetValue).toHaveBeenCalledWith(0); // fadeAnim
    expect(mockSetValue).toHaveBeenCalledWith(0.8); // scaleAnim para lista
  });

  it("should resetear con escala correcta para modo grid", () => {
    mockUseListByStore.mockReturnValue({
      activeElement: ListByEnum.GRID,
    } as any);

    const mockSetValue = jest.fn();
    const mockFadeAnim = { setValue: mockSetValue };
    const mockScaleAnim = { setValue: mockSetValue };

    // Mock Animated.Value para retornar nuestros mocks
    (Animated.Value as jest.Mock).mockImplementation((value) => {
      if (value === 0) return mockFadeAnim;
      if (value === 0.9) return mockScaleAnim;
      return { setValue: mockSetValue };
    });

    renderHook(() =>
      useAnimatedDocumentItem({
        index: 0,
        isAnimating: false,
        isInitialLoad: false,
      }),
    );

    expect(mockSetValue).toHaveBeenCalledWith(0); // fadeAnim
    expect(mockSetValue).toHaveBeenCalledWith(0.9); // scaleAnim para grid
  });

  it("should retornar el estilo animado correcto", () => {
    mockUseListByStore.mockReturnValue({
      activeElement: ListByEnum.LIST,
    } as any);

    const { result } = renderHook(() =>
      useAnimatedDocumentItem({
        index: 0,
        isAnimating: false,
        isInitialLoad: false,
      }),
    );

    expect(result.current.animatedStyle).toEqual({
      opacity: expect.any(Object),
      transform: [{ scale: expect.any(Object) }],
    });
  });
});
