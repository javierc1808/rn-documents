import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Text, View } from "react-native";

import { AuthProvider, useAuthContext } from "@/src/context/AuthContext";
import { User } from "@/src/models/types";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock faker
jest.mock("@faker-js/faker", () => ({
  faker: {
    string: {
      uuid: jest.fn(() => "mock-uuid-123"),
    },
    person: {
      fullName: jest.fn(() => "John Doe"),
    },
    internet: {
      email: jest.fn(() => "john.doe@example.com"),
    },
  },
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

// Test component to use the context
const TestComponent = () => {
  const auth = useAuthContext();
  return (
    <View>
      <Text testID="isAuthenticated">{auth.isAuthenticated.toString()}</Text>
      <Text testID="isLoading">{auth.isLoading.toString()}</Text>
      <Text testID="user">
        {auth.user ? JSON.stringify(auth.user) : "null"}
      </Text>
      <Text testID="authToken">{auth.authToken}</Text>
    </View>
  );
};

// Test component to test the hook error
const TestComponentWithoutProvider = () => {
  useAuthContext();
  return <Text>Should not render</Text>;
};

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("AuthProvider", () => {
    it("should render correctly with children", () => {
      const { getByText } = render(
        <AuthProvider>
          <Text>Test Child</Text>
        </AuthProvider>,
      );

      expect(getByText("Test Child")).toBeTruthy();
    });

    it("should initialize with loading state", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // Verify initial state
      expect(getByTestId("isLoading")).toHaveTextContent("true");
      expect(getByTestId("isAuthenticated")).toHaveTextContent("false");
    });

    it("should create a fake user when no saved data exists", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue();

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(getByTestId("isLoading")).toHaveTextContent("false");
        expect(getByTestId("isAuthenticated")).toHaveTextContent("true");
      });

      // Verify that a user was created
      const userData = JSON.parse(getByTestId("user").props.children);
      expect(userData).toEqual({
        id: "mock-uuid-123",
        name: "John Doe",
        email: "john.doe@example.com",
      });

      // Verify that it was saved to AsyncStorage
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          id: "mock-uuid-123",
          name: "John Doe",
          email: "john.doe@example.com",
        }),
      );
    });

    it("should load an existing user from AsyncStorage", async () => {
      const existingUser: User = {
        id: "existing-uuid",
        name: "Existing User",
        email: "existing@example.com",
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingUser));

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(getByTestId("isLoading")).toHaveTextContent("false");
        expect(getByTestId("isAuthenticated")).toHaveTextContent("true");
      });

      // Verify that the existing user was loaded
      const userData = JSON.parse(getByTestId("user").props.children);
      expect(userData).toEqual(existingUser);

      // Verify that a new user was not created
      expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it("should generate an authToken correctly", async () => {
      const existingUser: User = {
        id: "test-uuid",
        name: "Test User",
        email: "test@example.com",
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingUser));

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(getByTestId("isLoading")).toHaveTextContent("false");
      });

      // Verify that the authToken is generated correctly
      const authToken = getByTestId("authToken").props.children;
      const expectedToken = btoa(`${existingUser.name}:${existingUser.id}`);
      expect(authToken).toBe(expectedToken);
    });

    it("should return empty authToken when not authenticated", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // During initial loading, the authToken should be empty
      expect(getByTestId("authToken")).toHaveTextContent("");
    });

    it("should handle user data with lowercase email", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue();

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(getByTestId("isLoading")).toHaveTextContent("false");
        expect(getByTestId("isAuthenticated")).toHaveTextContent("true");
      });

      // Verify that the email is in lowercase
      const userData = JSON.parse(getByTestId("user").props.children);
      expect(userData.email).toBe("john.doe@example.com");
    });
  });

  describe("useAuthContext", () => {
    it("should return the context when used within AuthProvider", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(getByTestId("isLoading")).toHaveTextContent("false");
      });

      // Verify that the hook returns the correct values
      expect(getByTestId("isAuthenticated")).toHaveTextContent("true");
      expect(getByTestId("user")).not.toHaveTextContent("null");
      expect(getByTestId("authToken").props.children).toBeTruthy();
    });

    it("should throw error when used outside of AuthProvider", () => {
      // Suppress console error for the test
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow("useAuth must be used within an AuthProvider");

      consoleSpy.mockRestore();
    });
  });

  describe("Integration with faker", () => {
    it("should use faker to generate unique user data", async () => {
      // Reset mocks to use real faker
      jest.clearAllMocks();
      jest.unmock("@faker-js/faker");

      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue();

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(getByTestId("isLoading")).toHaveTextContent("false");
      });

      // Verify that a user was generated with valid data
      const userData = JSON.parse(getByTestId("user").props.children);
      expect(userData.id).toBeTruthy();
      expect(userData.name).toBeTruthy();
      expect(userData.email).toBeTruthy();
      expect(userData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Validate email format
    });
  });
});
