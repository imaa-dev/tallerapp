import { logoutRequest } from "@/services/auth/auth.service";
import { deleteToken, getToken, saveToken } from "@/utils/secureStorage";
import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react"

type AuthState = {
    token: string | null,
    isLoggedIn: boolean,
    login: (token: string) => Promise<void>;
    logout: () => void
}

export const AuthContext = createContext<AuthState>({
    token: null,
    isLoggedIn: false,
    login: async () => {},
    logout: async () => {}
})

export function AuthProvider({ children }: PropsWithChildren){
    const [token, setToken] = useState<string | null>(null)
    const router = useRouter();

    useEffect(() => {
        const loadToken = async () => {
            const storeToken = await getToken();
            if(storeToken){
                setToken(storeToken)
            }
        }
        loadToken();
    }, []);

    const login = async (newToken: string) => {
        await saveToken(newToken);
        setToken(newToken);
        router.replace("/");
    }

    const logout = async () => {
        try {
            await logoutRequest();
        } catch (error) {
            console.log("Error Logout backend", error);
        } finally {
            await deleteToken();
            setToken(null)
            router.replace("/login")
        }
    }

    return (
        <AuthContext.Provider value={{ token, isLoggedIn: !!token, login, logout }} >
            {children}
        </AuthContext.Provider>
    )
}