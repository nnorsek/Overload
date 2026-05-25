import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

type AuthUser = {
    token: string
    role: "ROLE_TRAINER" | "ROLE_CLIENT"
    email: string
    id: string
}

type AuthContextType = {
    user: AuthUser | null,
    login: (user: AuthUser) => void,
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        const stored = localStorage.getItem("auth");
        console.log("Stored",stored)
        return stored ? JSON.parse(stored) : null
    });

    const login = (user: AuthUser) => {
        setUser(user);
        localStorage.setItem("auth", JSON.stringify(user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth");
    };

    return  (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}


