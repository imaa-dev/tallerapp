import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import * as SecureStore from "expo-secure-store";

export type AppearanceMode = "light" | "dark" | "system";

const APPEARANCE_KEY = "appearance";

type AppearanceContextType = {
  appearance: AppearanceMode;
  setAppearance: (mode: AppearanceMode) => void;
};

const AppearanceContext = createContext<AppearanceContextType>({
  appearance: "system",
  setAppearance: () => {},
});

const applyAppearance = (mode: AppearanceMode) => {
  if (typeof Appearance.setColorScheme !== "function") {
    return;
  }
  Appearance.setColorScheme(mode === "system" ? null : mode);
};

export function AppearanceProvider({ children }: PropsWithChildren) {
  const [appearance, setAppearanceState] = useState<AppearanceMode>("system");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await SecureStore.getItemAsync(APPEARANCE_KEY);
      if (!mounted) {
        return;
      }
      const mode: AppearanceMode =
        stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
      setAppearanceState(mode);
      applyAppearance(mode);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setAppearance = (mode: AppearanceMode) => {
    setAppearanceState(mode);
    applyAppearance(mode);
    SecureStore.setItemAsync(APPEARANCE_KEY, mode).catch(() => {});
  };

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  return useContext(AppearanceContext);
}