import { logoutRequest } from "@/services/auth/auth.service";
import { Organization } from "@/types/organization/organization.type";
import { User } from "@/types/user/user.type";
import { deleteToken, getOrganizationId, getToken, getUser, saveOrganizationId, saveToken, saveUser } from "@/utils/secureStorage";
import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react"

type PendingLogin = {
    loginId: string;
    user: User;
    organizations: Organization[];
};

type AuthState = {
    token: string | null;
    user: User | null;
    pendingLogin: PendingLogin | null;
    startPendingLogin: (pending: PendingLogin) => void;
    clearPendingLogin: () => void;
    isLoggedIn: boolean;
    login: (token: string, user: User) => Promise<void>;
    logout: () => void;
};



export const AuthContext = createContext<AuthState>({
    token: null,
    user: null,
    pendingLogin: null,
    startPendingLogin: () => {},
    clearPendingLogin: () => {},
    isLoggedIn: false,
    login: async () => {},
    logout: async () => {}
})

export function AuthProvider({ children }: PropsWithChildren){
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [pendingLogin, setPendingLogin] =
        useState<PendingLogin | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadSession = async () => {
            
            const storeToken = await getToken()
            const storeUser = await getUser()

            if (storeToken) setToken(storeToken)
            if (storeUser) setUser(storeUser)
        }
        loadSession();
    }, []);
  
    const startPendingLogin = (pending: PendingLogin) => {
        setPendingLogin(pending);
    };

    const clearPendingLogin = () => {
        setPendingLogin(null);
    };
    const login = async (
        newToken: string,
        newUser: User
    ) => {
        
        await saveToken(newToken)
        await saveUser(newUser)

        setToken(newToken)
        setUser(newUser)

        router.replace("/")
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

            setToken(null)
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                pendingLogin,
                startPendingLogin,
                clearPendingLogin,
                isLoggedIn: !!token,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}