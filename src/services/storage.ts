import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from "zustand/middleware";

export const Storage = () : StateStorage => {
  const getItem = (name: string): Promise<string | null> => {
    const value = AsyncStorage.getItem(name);
    return value ?? null;
  }
  const removeItem = (name: string): Promise<void> => {
    return AsyncStorage.removeItem(name);
  }
  const setItem = (name: string, value: any): Promise<void> => {
    return AsyncStorage.setItem(name, value);
  }

  return { getItem, removeItem, setItem };
}
