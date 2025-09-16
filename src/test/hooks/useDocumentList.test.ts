import { renderHook } from "@testing-library/react-native";
import { useDocumentList } from "../../hooks/useDocumentList";

// Mock for los stores
jest.mock("../../stores/useListByStore", () => ({
  useListByStore: () => ({
    isGrid: () => false,
    isAnimating: false,
  }),
}));

jest.mock("../../stores/useSortByStore", () => ({
  useSortByStore: () => ({
    activeElement: "createdAt",
    isAnimating: false,
  }),
}));

jest.mock("../../stores/useDocumentsStore", () => ({
  useDocumentsStore: () => ({
    items: [],
  }),
}));

// Mock for React Native
jest.mock("react-native", () => ({
  useWindowDimensions: () => ({
    width: 375,
    height: 812,
  }),
  Dimensions: {
    get: jest.fn(() => ({
      width: 375,
      height: 812,
    })),
  },
}));

describe("useDocumentList", () => {
  it("should retornar las propiedades correctas para modo lista", () => {
    const { result } = renderHook(() => useDocumentList());

    expect(result.current).toMatchObject({
      itemWidth: expect.any(Number),
      columns: 1,
    });

    // rowHeight can be null in some cases
    expect(result.current.rowHeight).toBeDefined();

    expect(typeof result.current.onMeasureItem).toBe("function");
    expect(typeof result.current.handleAnimationComplete).toBe("function");
    expect(result.current.contentContainerStyle).toHaveProperty(
      "paddingHorizontal",
    );
  });

  it("should calcular el ancho del elemento correctamente", () => {
    const { result } = renderHook(() => useDocumentList());

    // In list mode, width should be screen width minus padding
    expect(result.current.itemWidth).toBeGreaterThan(0);
  });

  it("should tener un estilo de contenedor válido", () => {
    const { result } = renderHook(() => useDocumentList());

    expect(result.current.contentContainerStyle).toHaveProperty(
      "paddingHorizontal",
    );
    expect(result.current.contentContainerStyle).toHaveProperty("paddingTop");
    expect(result.current.contentContainerStyle).toHaveProperty(
      "paddingBottom",
    );
  });

  it("should tener funciones de callback definidas", () => {
    const { result } = renderHook(() => useDocumentList());

    expect(typeof result.current.onMeasureItem).toBe("function");
    expect(typeof result.current.handleAnimationComplete).toBe("function");
  });
});
