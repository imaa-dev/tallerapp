import { logoutRequest } from "@/services/auth/auth.service";
import { User } from "@/types/user.t";
import { deleteToken, getOrganizationId, getToken, getUser, saveOrganizationId, saveToken, saveUser } from "@/utils/secureStorage";
import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react"

type AuthState = {
    token: string | null,
    user: User | null,
    organizationId: number | null,
    isLoggedIn: boolean,
    login: (token: string, user: User, orgId: number | null) => Promise<void>
    logout: () => void
}

export const AuthContext = createContext<AuthState>({
    token: null,
    user: null,
    organizationId: null,
    isLoggedIn: false,
    login: async () => {},
    logout: async () => {}
})

export function AuthProvider({ children }: PropsWithChildren){
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [organizationId, setOrganizationId] = useState<number | null>(null)
    const router = useRouter();

    useEffect(() => {
        const loadSession = async () => {
            
            const storeToken = await getToken()
            const storeUser = await getUser()
            const storeOrg = await getOrganizationId()

            if (storeToken) setToken(storeToken)
            if (storeUser) setUser(storeUser)
            if (storeOrg) setOrganizationId(storeOrg)
        }
        loadSession();
    }, []);

    const login = async (
        newToken: string,
        newUser: User,
        orgId: number | null
    ) => {
        
        await saveToken(newToken)
        await saveUser(newUser)
        await saveOrganizationId(orgId)

        setToken(newToken)
        setUser(newUser)
        setOrganizationId(orgId)

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
            setOrganizationId(null)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                organizationId,
                isLoggedIn: !!token,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}