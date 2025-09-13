import { faker } from '@faker-js/faker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { User } from "@/src/models/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  authToken: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if there is a saved session when the app starts
  useEffect(() => {
    const getOrCreateFakeAuthData = async () => {
      let userString = await AsyncStorage.getItem('user');
      let user = userString ? JSON.parse(userString) as User : null;

      if (!user) {
        user = {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
        } as User;

        await AsyncStorage.setItem('user', JSON.stringify(user));
      }

      setUser(user);
      setIsAuthenticated(true);
      setIsLoading(false);
    }

    getOrCreateFakeAuthData();
  }, []);

  const authToken = useMemo(() => {
    if (isAuthenticated) {
      return btoa(`${user?.name}:${user?.id}`);
    }
    return '';
  }, [isAuthenticated, user]);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    authToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
